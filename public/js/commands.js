// CORE FUNCTIONALITY

function initializeDocument(){
  window.editor.innerHTML = "";
  const elem = document.createElement('div');
  elem.appendChild(new SelectButton());
  window.editor.appendChild(elem);
  setCaretPosition(0, 1);
}

function insertParagraph(){
  let selection = document.getSelection();
  let range = selection.getRangeAt(0);
  let endContainer = range.endContainer;
  let parent = range.commonAncestorContainer.parentElement;

  //New paragraph to be created
  const elem = document.createElement('div');
  //const br = document.createElement('br');
  //elem.appendChild(br);

  let index = null; //Index for the new paragraph
  if(window.editor.innerHTML !== ""){
    let target = getElementInCaret(selection);
    const start = range.startOffset;
    let first = null;

    elem.appendChild(new SelectButton());
    if(target.textContent.length !== start)
    {
      first = target.textContent.substring(0, start);
      const last = target.textContent.substring(start, target.textContent.length);

      //first = first === "" ? " " : first;

      // if(first == "")
      // {
      //   if(target.parentElement.id !== ""){
      //       const elem1 = document.createElement('div');
      //       const br1 = document.createElement('br');
      //       elem1.appendChild(br1);
      //       let newIndex = getIndex(window.editor.childNodes, target);
      //       target.parentElement.insertBefore(elem1, target);
      //       target.parentElement.removeChild(target);
      //       setCaretPosition(newIndex, 0);
      //       selection = document.getSelection();
      //       range = selection.getRangeAt(0);
      //       endContainer = range.endContainer;
      //     }
      //     else{
      //       const br2 = document.createElement('br');
      //       target.parentElement.appendChild(br2);
      //       target.textContent = "";
      //       parent = target.parentElement;
      //     }
      // }
      // else
      //   target.textContent = first;

      target.textContent = first;
      elem.append(last);
    }

    //If the selection's parent is the main editor (then the first line is selected)
    if(parent.id == "")
      parent.after(elem);
    else
      endContainer.after(elem);

    index = Array.prototype.indexOf.call(window.editor.children, elem);
  }
  else{
    const elem2 = elem.cloneNode(true);
    elem.appendChild(new SelectButton());
    elem2.appendChild(new SelectButton());
    window.editor.appendChild(elem);
    window.editor.appendChild(elem2);
    index = getIndex(window.editor.children, elem2);
  }

  if(index != null)
    setCaretPosition(index, 1);
}

function indentElement(){
  const sel = window.getSelection();

  if(sel !== null){
    const elem = getElementInCaret(sel).parentElement;

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
    const elem = getElementInCaret(sel).parentElement;

    if(elem.nodeName == "DIV" && elem.id != "editor"){
      if(elem.classList.contains('indentation')){
        let newValue = getComputedStyle(elem).getPropertyValue("--indentValue");
        if(parseInt(newValue[0]) > 1){
          newValue = (parseInt(newValue[0])-1) + "em";
          elem.style.setProperty('--indentValue', newValue);
        }
        else
        elem.classList.remove("indentation");
      }
    }
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
        return true;
      }
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
        console.log(parent);
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
      parent.classList.add('h' + value);
    }
    else {
      //Since the first child is not encapsulated, then this need to be done
      if(parent.childNodes.length > 0){
        const newDiv = document.createElement('div');
        newDiv.innerText = parent.firstChild.textContent;
        newDiv.classList.add('h' + value);
        parent.replaceChild(newDiv, parent.firstChild);
      }
    }
  }
}

function encapsulate(text, tag, className){
  return text = "<" + tag + " class=" + className + ">" + text + "</" + tag + ">";
}

//BUTTON CLICKS

function buttonClick(e){
  console.log("It worked:", e.target.value);
  if(e.target.value === "minus"){
    e.target.value = "plus";
    e.target.innerText = "+";
  }
  else {
    e.target.value = "minus";
    e.target.innerText = "-";
  }
}

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
