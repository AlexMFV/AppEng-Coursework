class SelectButton{
  constructor(value){
    this.button = document.createElement('button');
    this.button.addEventListener("click", buttonClick);
    this.button.classList.add("paragraphButton");
    this.button.style.width = "25px"; //25px
    this.button.style.height = "25px"; //25px
    this.button.innerText = "-"; // Other Bullet point: •
    this.button.value = "open"; //open or closed
    this.button.setAttribute("contenteditable", false);
    return this.button;
  }
}
