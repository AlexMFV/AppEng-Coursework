function insertParagraph(){
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  const endContainer = range.endContainer;
  const parent = range.commonAncestorContainer.parentElement;

  //New paragraph to be created
  const elem = document.createElement('div');
  elem.innerHTML = "<br />";

  let index = null; //Index for the new paragraph
  if(window.editor.innerHTML !== ""){
    //If the selection's parent is the main editor (then the first line is selected)
    if(parent.id == "")
      parent.after(elem);
    else
      endContainer.after(elem);

    index = Array.prototype.indexOf.call(window.editor.children, elem);
  }
  else{
    const elem2 = elem.cloneNode(true);
    window.editor.appendChild(elem);
    window.editor.appendChild(elem2);
    index = Array.prototype.indexOf.call(window.editor.children, elem2);
  }

  if(index != null)
    setCaretPosition(index, 0);

    //TODO:
    // 1 - First paragraph not changing
    // 2 - Handle when the user adds an Enter in the middle of a line
}

function setCaretPosition(elemIndex, position){
  const editor = document.getElementById('editor');
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(editor.children[elemIndex], position);
  //range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

//----------------------------------------------

function makeHeading(e){
  const index = document.getElementById('headingSelector').selectedIndex+1;
  const target = e.target;
  const selection = document.getSelection();
  //const range = selection.getRangeAt(0);

  //If a selection exists
  if(selection.type !== "None"){
    const parent = selection.anchorNode.parentElement;
    //If selection's parent is a DIV
    if(parent.nodeName === "DIV"){
      //If the selection is not the first paragraph nor its empty
      if(parent.id == "" && !parent.classList.contains('container')){
        parent.classList.remove('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
        parent.classList.add('h'+index);
      }
      else {
        //Encapsulate the initial paragraph which has no div enclosure,
        //then add the class to that new div
      }
    }
      //If selection includes more than one div (multiple paragraphs)
  }
}

function boldText(target){
  const editor = document.getElementById("editor");
  let sel = window.getSelection().toString();

  if(sel != ""){
    if(sel.includes("<span") && sel.includes("bold")){

    }
    else{
      console.log("Before: " + sel);
      let newSel = encapsulate(sel, mods.bold);
      console.log("After: " + newSel);
      editor.innerHTML = editor.innerHTML.replace(sel, newSel);
    }
  }
}

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
//
//function encapsulate(text, className){
//  return text = "<span class=" + className + ">" + text + "</span>";
//}
//
////Function to decapsulate a function
//function decapsulate(text){
//
//}
