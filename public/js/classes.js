class SelectButton{
  constructor(value){
    this.button = document.createElement('button');
    this.button.addEventListener("click", buttonClick);
    this.button.addEventListener('dblclick', buttonDoubleClick);
    this.button.classList.add("paragraphButton");
    this.button.style.width = "25px";
    this.button.style.height = "25px";
    this.button.innerText = "-";
    this.button.value = "open"; //open or closed
    this.button.setAttribute("contenteditable", false);
    return this.button;
  }
}
