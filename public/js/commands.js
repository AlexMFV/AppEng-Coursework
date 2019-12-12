// CORE FUNCTIONALITY

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

  if(baseValue === "20px" && !target.classList.contains('indentation'))
    return "0px";
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
        newValue = newValue.replace('px', '');
        if(parseInt(newValue) <= 200){
          newValue = (parseInt(newValue)+20) + "px";
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
        newValue = newValue.replace('px', '');
        if(parseInt(newValue) > 20){
          newValue = (parseInt(newValue)-20) + "px";
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
      if(lines[i].innerHTML.includes('<br>') || lines[i].children.length < 1)
        window.editor.removeChild(lines[i]);
      else
        lines[i].children[0].innerText = '-';

      break;
    }
    else{
      if(lines[i].classList.contains('hidden') || lines[i].children[0].value === "closed")
        continue;

      let currentStyle = getIndentValue(lines[i]).replace('px', '');
      let nextStyle = getIndentValue(lines[i+1]).replace('px', '');

      if(parseInt(nextStyle) > parseInt(currentStyle))
        lines[i].children[0].innerText = '+';
      else
        lines[i].children[0].innerText = '-';
    }
  }
}

function deleteDocument(){
  if(userInfo.loggedIn){
    deleteFromDatabase();
  }
  else{
    clearLocalFile();
    initializeDocument();
  }
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

function textualPointShortcut(value){
  const selection = document.getSelection();
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
        applyTextualPoint(parent, parseInt(value))
      }
    }
    else
      applyTextualPoint(parent, parseInt(value));
  }
}

function textualPoint(e){
  const index = document.getElementById('levelSelector').selectedIndex+1;
  //const target = e.target;
  const selection = document.getSelection();

  //If a selection exists
  if(selection.type !== "None"){
    let parent = selection.anchorNode.parentElement;
    const range = selection.getRangeAt(0);

    if(parent == window.editor)
      parent = range.startContainer;

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

    if(!parent.classList.contains('indentation') && baseValue === "20px")
      baseValue = "0px";

    for(let i = 0; i < children.length; i++){
      if(i > index){
        let selectedValue = getComputedStyle(children[i]).getPropertyValue('--indentValue');

        if(!children[i].classList.contains('indentation') && selectedValue === "20px")
          selectedValue = "0px";

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

function localLoad(){
  if(loadFromLocalFile())
    reloadButtons();
}

//STATES / CHANGES

function setUserState(bool){
  localStorage.setItem("userLogged", bool);
}

function getUserState(){
  return localStorage.getItem("userLogged");
}

function valueChanged(e){
  loadUserDocument(e.target.selectedIndex);
}

//SERVER/DATABASE METHODS

async function saveToDatabase(){
  const fileIds = document.getElementById('fileCbb');
  const content = window.editor.innerHTML;
  const fileId = userInfo.data[fileIds.selectedIndex].id;

  const data = { fileId, content };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/api/savefile', options)
    .then((response) => { return response.json(); });

    if(response)
      checkState(state.saved);
    else
      checkState(state.error);
}

async function deleteFromDatabase(){
  const fileIds = document.getElementById('fileCbb');
  const fileId = userInfo.data[fileIds.selectedIndex].id;

  const data = { fileId };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/api/deleteFile', options)
    .then((response) => { return response.json(); });

    if(response){
      alert("File deleted successfully!");
      reloadIndex();
    }
    else
      alert("There was a problem deleting the file from the database!");
}

async function renameInDatabase(){
  const fileIds = document.getElementById('fileCbb');
  const fileId = userInfo.data[fileIds.selectedIndex].id;
  const newName = promptFileName(userInfo.data.length);

  const data = { fileId, newName };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/api/renamefile', options)
    .then((response) => { return response.json(); });

    if(response !== false){
      alert("Successfully renamed the file");
      const idx = fileIds.selectedIndex;
      fileIds[idx].innerText = response;
    }
    else
      alert("There was an error while renaming the file");
}

function loadUserDocument(id){
  window.editor.innerHTML = userInfo.data[id].contents;
  reloadButtons();
}

async function afterLoad(){
  const isLoggedIn = await isUserLoggedIn();
  if(isLoggedIn){
    userInfo.loggedIn = true;
    const files = await getUserFiles();
    userInfo.data = files;
    processUserLogin(files);

    if(files !== null)
      if(files.length > 0)
        loadUserDocument(0);
  }
  else{
    userInfo.loggedIn = false;
    userInfo.data = {};
    localLoad();
  }
}

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
            reloadIndex(); //?user=" + usr;
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
        reloadIndex(); //?user=" + usr;
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
  const response = await fetch('/api/userfiles', {})
    .then((response) => {return response.json();});
  return response;
}

async function isUserLoggedIn(){
  const response = await fetch('/api/user', {})
    .then((response) => {return response.json();});
    return response;
}

async function processUserLogin(files){
  setUserState(true);

  const loginButton = document.getElementById('loginButton').classList.add('hidden');
  const filesElem = document.getElementById('fileCbb');
  filesElem.classList.remove('hidden');
  filesElem.addEventListener('change', valueChanged);

  if(files !== null){
    for(let i = 0; i < files.length; i++){
      let child = document.createElement('option');
      child.value = files[i].id;
      child.innerText = files[i].file_name;
      filesElem.appendChild(child);
    }
  }
  else{
    const fileName = promptFileName(0);
    const data = await createNewDocument(fileName);
    userInfo.data = data;

    let child = document.createElement('option');
    child.value = userInfo.data[0].id;
    child.innerText = userInfo.data[0].file_name;
    filesElem.appendChild(child);
  }
  const logoutButton = document.getElementById('logoutButton').classList.remove('hidden');
  const newButton = document.getElementById('createDoc').classList.remove('hidden');
  const renameButton = document.getElementById('alterDoc').classList.remove('hidden');
}

async function createNewDocument(filename){
  const data = { filename };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('/api/newfile', options)
    .then((response) => {return response.json();});
    return response;

    //After creating the document switch to the newly created document
}

async function logoutUser(){
  if(await logOut()){
    userInfo.loggedIn = false;
    userInfo.data = {};
    alert("Successfully logged out the user!");
    reloadIndex();
  }
  else
    alert("There was a problem logging out, please try again!");
}

async function logOut(){
  const response = await fetch('/api/logout', {})
    .then((response) => {return response.json();});
    return response;
}

//RANDOM METHODS

function reloadIndex(){
  window.location.href = "./index.html";
}

function reloadButtons(){
  let mainchildren = window.editor.children;
  for(let i = 0; i < mainchildren.length; i++){
    for(let j = 0; j < mainchildren[i].children.length; j++)
    {
      if(mainchildren[i].children[j].tagName === types.button){
        mainchildren[i].children[j].addEventListener("click", buttonClick);
        mainchildren[i].children[j].addEventListener('dblclick', buttonDoubleClick);
      }
    }
  }
}

function promptFileName(fileNum){
  let name;

  if(fileNum <= 0)
    name = prompt("Please enter a name for the file", "File 1");
  else
    name = prompt("Please enter a name for the file", "File " + fileNum);

  if(name !== null)
    return name;
  else
    return "File " + fileNum.toString();
}
