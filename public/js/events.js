let interval;

const types = {
  "button":"BUTTON",
  "select":"SELECT"
};

const mods = {
  "level":"level",
  "bold":"bold",
  "italic":"italic",
  "strike":"strike",
  "underline":"underline",
  "font":"font",
  "indent":"plusIndent",
  "deindent":"minusIndent",
  "del":"docDelete",
  "logout":"logout",
  "create":"newDoc",
  "save":"saveDoc",
  "rename":"renameDoc"
};

const state = {
  "notsaved":"notsaved",
  "saving":"saving",
  "saved":"saved"
};

window.btnModal.onclick = (e) => {
  modal.style.display = "block";
}

window.btnClose.onclick = (e) => {
  modal.style.display = "none";
}

window.onload = async () => {
  let buttons = document.getElementById('toolbar').children[0].children;

  for(let i = 0; i < buttons.length; i++){
    if(buttons[i].tagName === types.button){
      buttons[i].addEventListener("click", loadCommand);
    }
    else if(buttons[i].tagName === types.select)
      buttons[i].addEventListener("change", loadCommand);
  }
};

window.editor.onkeydown = (e) => {
  let toReturn;
  clearTimeout(interval);

  if(window.editor.innerHTML == "" || window.editor.innerHTML == "<br>"){
    initializeDocument();
  }

  if(e.key >= "1" && e.key <= "7" && (e.metaKey || e.ctrlKey)){
    textualPointShortcut(e.key);
    toReturn = false;
  }

  if(e.ctrlKey && e.code == "KeyS"){
    setTimer();
    toReturn = false;
  }

  //Disable bold
  if(e.code === "KeyB" && (e.metaKey || e.ctrlKey)){
    toReturn = false;
  }

  //Disable underline
  if(e.code === "KeyU" && (e.metaKey || e.ctrlKey)){
    toReturn = false;
  }

  //Disable Italic
  if(e.code === "KeyI" && (e.metaKey || e.ctrlKey)){
    toReturn = false;
  }

  if(e.code === "Backspace"){
    if(processBackSpace())
      toReturn = false;
  }

  if(e.code === "Tab"){
    if(e.shiftKey === false)
      indentElement();
    else
      deindentElement();

    updateHierarchy();
    toReturn = false;
  }

  if(e.code === "Enter"){
    insertLine();
    updateHierarchy();
    toReturn = false; //Disables the Enter key
  }

  setTimer();

  return toReturn;
};

//Determines if the commands needs a value or not then runs the funtion that executes it
function loadCommand(e) {
  clearTimeout(interval);
  //If there's a value to be determined it splits the string into command and value (NOT USED ATM)
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
    case mods.level: textualPoint(e); setTimer(); break;
    case mods.indent: indentElement(); updateHierarchy(); setTimer(); break;
    case mods.deindent: deindentElement(); updateHierarchy(); setTimer(); break;
    case mods.logout: logoutUser(); break;
    case mods.create: createNewDocument(promptFileName(userInfo.data.length)); reloadIndex(); break;
    case mods.save: setTimer(); break;
    case mods.rename: renameInDatabase(); break;
    case mods.del: deleteDocument(); break;
  }
}

//Executes commands that need to have a value
function multiModify(target, command, value){
  switch(command){
    //case mods.font: fontText(e.target, value); break;
  }
}

function setTimer(){
  checkState(state.saving);
  if(userInfo.loggedIn)
    interval = setTimeout(saveToDatabase, 1500);
  else
    interval = setTimeout(saveToLocalFile, 1500);
}

function checkState(type){
  switch(type){
    case state.notsaved: setNotSaved(); break;
    case state.saving: setSaving(); break;
    case state.saved: setSaved(); break;
    case state.error: setError(); break;
  }
}

function setNotSaved(){
  window.saveState.className = "notsaved";
  window.saveState.innerText = "Not Saved!";
}

function setSaving(){
  window.saveState.className = "saving";
  window.saveState.innerText = "Saving...";
}

function setSaved(){
  window.saveState.className = "saved";
  window.saveState.innerText = "Saved";
}

function setError(){
  window.saveState.className = "error";
  window.saveState.innerText = "ERROR";
}
