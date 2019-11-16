//window.designMode = "on";

//Enum that defines the buttons
const types = {
  "button":"BUTTON",
  "select":"SELECT"
};

const mods = {
  "heading":"heading",
  "bold":"bold",
  "italic":"italic",
  "strike":"strike",
  "underline":"underline",
  "font":"font"
};

//Runds through all the toolbar children, ie. the buttons to modify the text
//and adds an eventlistener on click, to execute the required command.
window.onload = () => {
  let buttons = document.getElementById('toolbar').children;

  for(let i = 0; i < buttons.length; i++){
    if(buttons[i].tagName === types.button)
      buttons[i].addEventListener("click", loadCommand);
    else if(buttons[i].tagName === types.select)
      buttons[i].addEventListener("change", loadCommand);
  }
};

window.editor.onkeydown = (e) => {
  if(e.code === "Tab"){
    //indent();
    return false;
  }

  if(e.code === "Enter"){
    insertParagraph();
    return false; //Disables the Enter key
  }
};

//Determines if the commands needs a value or not then runs the funtion that executes it
function loadCommand(e) {
  //If there's a value to be determined it splits the string into command and value
  if(e.target.value.includes(','))
  {
      const command = e.target.value.split(',')[0];
      const value = e.target.value.split(',')[1];

      multiModify(e.target, command, value);
  }
  else{
      modify(e.target, e.target.value, e);
  }
}

//Executes single commands (commands that dont need a value)
function modify(target, command, e){
  switch(command){
    case mods.heading: makeHeading(e); break;
    case mods.bold: boldText(e.target); break;
    case mods.italic: italicText(e.target); break;
    case mods.underline: underlineText(e.target); break;
    case mods.strike: strikeText(e.target); break;
  }
}

//Executes commands that need to have a value
function multiModify(target, command, value){
  switch(command){
    case mods.font: fontText(e.target, value); break;
  }
}
