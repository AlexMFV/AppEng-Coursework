//Inserts a new line when the Enter key has been pressed
function insertLine(target){
  const line = document.createElement("div");
  line.setAttribute("class", "line");
  target.appendChild(line);
  const index = Array.prototype.indexOf.call(target.children, line);
  console.log(index);
  target.children[index].focus();
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

function italicText(target){
  console.log("Italic On/Off");
}

function underlineText(target){
  console.log("Underline On/Off");
}

function strikeText(target){
  console.log("Strike On/Off");
}

function fontText(target, value){
  console.log("Font Level: " + value);
}

function encapsulate(text, className){
  return text = "<span class=" + className + ">" + text + "</span>";
}

//Function to decapsulate a function
function decapsulate(text){

}
