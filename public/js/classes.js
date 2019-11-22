class SelectButton{
  constructor(value){
    this.button = document.createElement('button');
    this.button.addEventListener("click", buttonClick);
    this.button.classList.add("paragraphButton");
    this.button.innerText = "-";
    this.button.value = "minus"; //minus or plus
    this.button.setAttribute("contenteditable", false);
    return this.button;
  }
}
