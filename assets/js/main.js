function goTo(link) {
  window.location.href = link;
}

function rotateArrow() {
  const arrowDown = document.getElementById("arrowDown");
  const files = document.getElementById("files");
  const isRight = arrowDown.classList.contains("right");

  arrowDown.style.transform = isRight ? "rotate(0deg)" : "rotate(-90deg)";
  arrowDown.classList.toggle("right");
  files.style.display = isRight ? "block" : "none";
}
