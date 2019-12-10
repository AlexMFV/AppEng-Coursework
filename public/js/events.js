let interval;

//Enum that defines the buttons
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
  "del":"docDelete"
};

const state = {
  "notsaved":"notsaved",
  "saving":"saving",
  "saved":"saved"
};

//Runds through all the toolbar children, ie. the buttons to modify the text
//and adds an eventlistener on click, to execute the required command.
window.onload = () => {
  setUserState(false);

  userLoggedIn();

  let buttons = document.getElementById('toolbar').children;

  for(let i = 0; i < buttons.length; i++){
    if(buttons[i].tagName === types.button){
      buttons[i].addEventListener("click", loadCommand);
    }
    else if(buttons[i].tagName === types.select)
      buttons[i].addEventListener("change", loadCommand);
  }

  let mainchildren = window.editor.children;
  if(loadFromLocalFile()){
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
};

window.editor.onkeydown = (e) => {
  let toReturn;
  clearTimeout(interval);
  checkState(state.saving);

  if(window.editor.innerHTML == "" || window.editor.innerHTML == "<br>"){
    initializeDocument();
  }

  // if(e.code === "KeyB" && (e.metaKey || e.ctrlKey)){
  //   //boldText();
  //   return false;
  // }
  //
  // if(e.code === "KeyU" && (e.metaKey || e.ctrlKey)){
  //   //underlineText();
  //   return false;
  // }
  //
  // if(e.code === "KeyI" && (e.metaKey || e.ctrlKey)){
  //   //italicText();
  //   return false;
  // }

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
    case mods.level: textualPoint(e); break;
    case mods.bold: boldText(e.target); break;
    case mods.italic: italicText(e.target); break;
    case mods.underline: underlineText(e.target); break;
    case mods.strike: strikeText(e.target); break;
    case mods.indent: indentElement(); break;
    case mods.deindent: deindentElement(); break;
    case mods.del: deleteDocument(); break;
  }
}

//Executes commands that need to have a value
function multiModify(target, command, value){
  switch(command){
    case mods.font: fontText(e.target, value); break;
  }
}

function setTimer(){
  interval = setTimeout(saveToLocalFile, 1500);
}

function checkState(type){
  switch(type){
    case state.notsaved: setNotSaved(); break;
    case state.saving: setSaving(); break;
    case state.saved: setSaved(); break;
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

async function userLoggedIn(){
  const isLoggedIn = await isUserLoggedIn();

  if(isLoggedIn){
    setUserState(true);
    const files = await getUserData();
    console.log("Session:", files); // DEBUG: Check

    const loginButton = document.getElementById('loginButton').classList.add('hidden');
    const filesElem = document.getElementById('fileCbb');
    filesElem.classList.remove('hidden');
    filesElem.addEventListener('change', valueChanged);
    //FillComboBox with values from the database
    for(let i = 0; i < files.length; i++){
      let child = document.createElement('option');
      child.value = files[i].id;
      child.innerText = files[i].file_name;
      filesElem.appendChild(child);
    }
    const logoutButton = document.getElementById('logoutButton').classList.remove('hidden');
  }
}

function valueChanged(e){
  console.log("The value of the Combobox is now: " + e.target.value);
}

function setUserState(bool){
  localStorage.setItem("userLogged", bool);
}

function getUserState(){
  return localStorage.getItem("userLogged");
}

function isUserLoggedIn(){
  const options = {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        };

  fetch('/index', options).then(function(res) {

    res.json().then(function(session) {
      if(session !== undefined)
          return true;
      else
        return false;
    });
  }).catch(function(err) {
    console.log('Fetch Error: ', err);
  });
}
