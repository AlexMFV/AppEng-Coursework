class SelectButton{
  constructor(value){
    this.button = document.createElement('button');
    this.button.addEventListener("click", buttonClick);
    //this.insideElem = document.createElement('i');
    //this.insideElem.classList.add("fa");
    //this.insideElem.classList.add("fa-minus");
    //this.button.appendChild(this.insideElem);
    this.button.innerText = "-";
    this.button.value = "minus"; //minus or plus
    this.button.setAttribute("contenteditable", false);
    return this.button;
  }
}
