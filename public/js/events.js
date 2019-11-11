//window.designMode = "on";

//Enum that defines the buttons
const types = {"button":"BUTTON", "select":"SELECT"};

//Runds through all the toolbar children, ie. the buttons to modify the text
//and adds an eventlistener on click, to execute the required command.
window.onload = () => {
  let buttons = document.getElementById('toolbar').children;

  for(let i = 0; i < buttons.length; i++){
    if(buttons[i].tagName === types.button)
      buttons[i].addEventListener("click", executeCommand);
    else if(buttons[i].tagName === types.select)
      buttons[i].addEventListener("change", executeCommand);
  }
};

//Executes the command that's defined on the button (bold, italics)
function executeCommand(e) {
  //If there's a value to be determined it splits the string into command and value
  if(e.target.value.includes(','))
  {
      const command = e.target.value.split(',')[0];
      const value = e.target.value.split(',')[1];

      document.execCommand(command, false, value);
  }
  else{
      document.execCommand(e.target.value, false);
  }
}
