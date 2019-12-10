// CORE FUNCTIONALITY
function loadDocument(){
  loadFromLocalFile();
}

function initializeDocument(){
  window.editor.innerHTML = "";
  const elem = document.createElement('div');
  elem.appendChild(new SelectButton());
  window.editor.appendChild(elem);
  setCaretPosition(0, 1);
}

function insertLine(){
  let selection = document.getSelection();
  let range = selection.getRangeAt(0);
  let endContainer = range.endContainer;
  let parent = range.commonAncestorContainer.parentElement;
  //New paragraph to be created
  const elem = document.createElement('div');
  elem.classList.add('line');

  let index = null; //Index for the new paragraph
  if(window.editor.innerHTML !== ""){
    let target = getElementInCaret(selection);
    const start = range.startOffset;
    let first = null;
    const childNodes = window.editor.childNodes;

    if(target.parentElement.classList.contains('indentation')){
      let indentValue = getComputedStyle(target.parentElement).getPropertyValue("--indentValue");
      elem.classList.add('indentation');
      elem.style.setProperty('--indentValue', indentValue);
    }

    elem.appendChild(new SelectButton());
    if(target.textContent.length !== start)
    {
      first = target.textContent.substring(0, start);
      const last = target.textContent.substring(start, target.textContent.length);
      target.textContent = first;
      elem.append(last);
    }

    //If the selection's parent is the main editor (then the first line is selected)
    let containerIndex;
    if(parent.id == "")
      containerIndex = getIndex(childNodes, parent);
    else
      containerIndex = getIndex(childNodes, endContainer);

    //This is needed in case there is a collapsed div and the user adds a line break at the end of the collapsed DIV
    //It needs to go to the last child and add the new line break after that child instead.
    if(childNodes[containerIndex].children[0].textContent === "+"){
      let baseValue = getIndentValue(target.parentElement);
      for(let i = containerIndex; i < childNodes.length; i++){

        if(i == containerIndex)
          continue;

        let child = childNodes[i];
        let selectedValue = getIndentValue(child);

        if(selectedValue <= baseValue){
          child.before(elem);
          break;
        }

        if(i == childNodes.length-1)
          child.after(elem);
      }
    }
    else
      childNodes[containerIndex].after(elem);

    index = getIndex(window.editor.children, elem);
  }

  if(index != null)
    setCaretPosition(index, 1);
}

function getIndentValue(target){
  const baseValue = getComputedStyle(target).getPropertyValue('--indentValue');

  if(baseValue === "1em" && !target.classList.contains('indentation'))
    return "0em";
  return baseValue;
}

function indentElement(){
  const sel = window.getSelection();

  if(sel !== null){
    let elem = getElementInCaret(sel);

    if(elem.nodeName === "#text")
      elem = elem.parentElement;

    if(elem.nodeName == "DIV" && elem.id != "editor"){
      if(!elem.classList.contains('indentation'))
        elem.classList.add('indentation');
      else{
        let newValue = getComputedStyle(elem).getPropertyValue("--indentValue");
        if(parseInt(newValue[0]) <= 8){
          newValue = (parseInt(newValue[0])+1) + "em";
          elem.style.setProperty('--indentValue', newValue);
        }
      }
    }
  }
}

function deindentElement(){
  const sel = window.getSelection();

  if(sel !== null){
    let elem = getElementInCaret(sel);

    if(elem.nodeName === "#text")
      elem = elem.parentElement;

    if(elem.nodeName == "DIV" && elem.id != "editor"){
      if(elem.classList.contains('indentation')){
        let newValue = getComputedStyle(elem).getPropertyValue("--indentValue");
        if(parseInt(newValue[0]) > 1){
          newValue = (parseInt(newValue[0])-1) + "em";
          elem.style.setProperty('--indentValue', newValue);
        }
        else{
          elem.classList.remove("indentation");
          elem.removeAttribute('style');
        }
      }
    }
  }
}

function updateHierarchy(){
  const lines = window.editor.children;

  for(let i = 0; i < lines.length; i++){
    if(i+1 >= lines.length){
      lines[i].children[0].innerText = '-';
      break;
    }
    else{
      if(lines[i].classList.contains('hidden') || lines[i].children[0].value === "closed")
        continue;

      let currentStyle = getIndentValue(lines[i]);
      let nextStyle = getIndentValue(lines[i+1]);

      if(nextStyle > currentStyle)
        lines[i].children[0].innerText = '+';
      else
        lines[i].children[0].innerText = '-';
    }
  }
}

function deleteDocument(){
  clearLocalFile();
  initializeDocument();
}

// CARET GET/SET

function processBackSpace(){
  const sel = window.getSelection();
  if(sel.rangeCount){
    const range = sel.getRangeAt(0);
    if(range.endOffset === 0){
      const toDelete = getElementInCaret(sel);
      if(toDelete.innerHTML !== "<br>" && toDelete.innerHTML !== ""){
        window.editor.removeChild(toDelete.parentElement);
        updateHierarchy();
        return true;
      }
      updateHierarchy();
    }
  }
  return false;
}

function getElementInCaret(selection){
  const range = selection.getRangeAt(0);
  return range.endContainer;
}

function setCaretPosition(elemIndex, position){
  const editor = document.getElementById('editor');
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(editor.children[elemIndex], position);
  sel.removeAllRanges();
  sel.addRange(range);
}

function getIndex(target, elem){
  return Array.prototype.indexOf.call(target, elem);
}

//TEXT FORMATING AND STYLING

function textualPoint(e){
  const index = document.getElementById('levelSelector').selectedIndex+1;
  //const target = e.target;
  const selection = document.getSelection();

  //If a selection exists
  if(selection.type !== "None"){
    let parent = selection.anchorNode.parentElement;
    const range = selection.getRangeAt(0);
    let startContainer = getIndex(window.editor.childNodes, range.startContainer.parentElement);
    let endContainer = getIndex(window.editor.childNodes, range.endContainer.parentElement);

    if(startContainer === -1)
      startContainer = 0;

    if(endContainer === -1)
      endContainer = 0;

    if(startContainer !== endContainer){
      for(let i = startContainer; i <= endContainer; i++){
        if(window.editor.childNodes[i].nodeName === "#text")
          parent = window.editor.childNodes[i].parentElement;
        else
          parent = window.editor.childNodes[i];
        applyTextualPoint(parent, index)
      }
    }
    else
      applyTextualPoint(parent, index);
  }
}

function applyTextualPoint(parent, value){
  //If selection's parent is a DIV
  if(parent.nodeName === "DIV"){
    //If the selection is not the first paragraph nor its empty
    if(parent.id == "" && !parent.classList.contains('container')){
      parent.classList.remove('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
      if(value !== 4)
        parent.classList.add('h' + (value > 4 ? value-1 : value));
    }
    else {
      //Since the first child is not encapsulated, then this need to be done
      if(parent.childNodes.length > 0){
        const newDiv = document.createElement('div');
        newDiv.innerText = parent.firstChild.textContent;
        if(value !== 4)
          newDiv.classList.add('h' + (value > 4 ? value-1 : value));
        parent.replaceChild(newDiv, parent.firstChild);
      }
    }
  }
}

function encapsulate(text, tag, className){
  return text = "<" + tag + " class=" + className + ">" + text + "</" + tag + ">";
}

//BUTTON CLICKS

function buttonDoubleClick(e){
  if(e.target.textContent === "+"){
    const children = window.editor.children;
    const index = getIndex(children, e.target.parentElement);
    const parent = e.target.parentElement;
    let baseValue = getComputedStyle(parent).getPropertyValue('--indentValue');

    if(!parent.classList.contains('indentation') && baseValue === "1em")
      baseValue = "0em";

    for(let i = 0; i < children.length; i++){
      if(i > index){
        let selectedValue = getComputedStyle(children[i]).getPropertyValue('--indentValue');

        if(!children[i].classList.contains('indentation') && selectedValue === "1em")
          selectedValue = "0em";

        if(selectedValue <= baseValue)
          break;
        else{
          if(e.target.value === "open")
            children[i].classList.add('hidden');
          else
            children[i].classList.remove('hidden');
        }
      }
    }

    if(e.target.value === "open")
      e.target.value = "closed";
    else
      e.target.value = "open";
  }
}

function buttonClick(e){
  const startContainer = e.target.parentElement;
  const children = window.editor.children;
  let endContainer;
  const baseStyle = getIndentValue(startContainer);

  for(let i = getIndex(children, startContainer)+1; i < children.length; i++){
    if(getIndentValue(children[i]) <= baseStyle){
      endContainer = children[i-1];
      break;
    }

    if(i === children.length-1)
      endContainer = children[i];
  }

  if(endContainer == undefined)
    endContainer = startContainer;

  const newRange = document.createRange();
  const elemLength = endContainer.innerText.length;

  newRange.setStart(startContainer, 1);
  newRange.setEndAfter(endContainer);

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(newRange);
}

//LOCAL STORAGE

function saveToLocalFile(){
  localStorage.setItem("personalDoc", window.editor.innerHTML);
  checkState(state.saved);
}

function loadFromLocalFile(){
  if(localStorage.personalDoc){
    window.editor.innerHTML = localStorage.getItem("personalDoc");
    return true;
  }
  else
    localStorage.setItem("personalDoc", "");

  return false;
}

function clearLocalFile(){
  localStorage.setItem("personalDoc", "");
}

//SERVER/DATABASE METHODS

async function createAccount(){
  const user = document.getElementById('cUser');
  const pass = document.getElementById('cPwd');
  const repass = document.getElementById('cCheckPwd');

  if(user.value !== ""){
    if(pass.value === repass.value && pass.value !== ""){
      const usr = user.value;
      const pwd = pass.value;

      const data = { usr, pwd };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };

      await fetch('/api/create', options).then(function(res) {
        if (res.status !== 200) {
          console.log('There was a problem. Status Code: ' +
          res.status);
          return;
        }

        res.json().then(function(exists) {
          if(!exists){
            alert("Account created successfully, you will now be redirected!");
            window.location.href = "./index.html"; //?user=" + usr;
          }
          else{
            alert("Account could not be created, user already exists!");
          }
        });
      }).catch(function(err) {
        console.log('Fetch Error: ', err);
      });

      return false;
    }
    else
    alert("Passwords need to be valid and be the same!");
  }
  else {
    alert("User is invalid!");
  }
}

async function loginAccount(){
  const usr = document.getElementById('lUser').value;
  const pwd = document.getElementById('lPwd').value;

  const data = { usr, pwd };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  await fetch('/api/login', options).then(function(res) {
    if (res.status !== 200) {
      console.log('There was a problem. Status Code: ' +
      res.status);
      return;
    }

    res.json().then(function(exists) {
      if(exists){
        alert("Login Successful, redirecting...");
        window.location.href = "./index.html"; //?user=" + usr;
      }
      else{
        alert("Incorrect details, please try again!");
      }
    });
  }).catch(function(err) {
    console.log('Fetch Error: ', err);
  });

  return false;
}

async function getUserFiles(){
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };

  await fetch('/files/user', options).then(function(res) {
    res.json().then(function(files) {
      console.log(files);
    });
  }).catch(function(err) {
    console.log('Fetch Error: ', err);
  });
}

//TODO:

//If the user has a session then load All the file names TO A COMBOBOX according to that User (GetUserID then GetAllFilesFromUserID).
//When the user changes the file in the combobox load that file from the database.
//Add the ability for the user to Delete a file permanently (From the database ofc).

//-------------------------------------------------

//function boldText(target){
//  const editor = document.getElementById("editor");
//  let sel = window.getSelection().toString();
//
//  if(sel != ""){
//    if(sel.includes("<span") && sel.includes("bold")){
//
//    }
//    else{
//      console.log("Before: " + sel);
//      let newSel = encapsulate(sel, "span", mods.bold);
//      console.log("After: " + newSel);
//      editor.innerHTML = editor.innerHTML.replace(sel, newSel);
//    }
//  }
//}

//function italicText(target){
//  console.log("Italic On/Off");
//}
//
//function underlineText(target){
//  console.log("Underline On/Off");
//}
//
//function strikeText(target){
//  console.log("Strike On/Off");
//}
//
//function fontText(target, value){
//  console.log("Font Level: " + value);
//}

////Function to decapsulate a function
//function decapsulate(text){
//
//}
