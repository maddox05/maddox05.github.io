function rotateArrow() {
  const arrowDown = document.getElementById("arrowDown");
  if (arrowDown.classList.contains("right")) {
    arrowDown.style.transform = "rotate(0deg)";
    arrowDown.classList.toggle("right");
  } else {
    arrowDown.style.transform = "rotate(-90deg)";
    arrowDown.classList.toggle("right");
  }
}
