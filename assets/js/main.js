function rotateArrow() {
  const arrowDown = document.getElementById("arrowDown");
  const files = document.getElementById("files");
  if (arrowDown.classList.contains("right")) {
    arrowDown.style.transform = "rotate(0deg)";
    arrowDown.classList.toggle("right");
    files.style.display = "block";
  } else {
    arrowDown.style.transform = "rotate(-90deg)";
    arrowDown.classList.toggle("right");
    files.style.display = "none";
  }
}

function goTo(link) {
  window.location.href = link;
}
