function goTo(link) {
  window.open(link, "_blank");
}

function rotateArrow() {
  const arrowDown = document.getElementById("arrowDown");
  const files = document.getElementById("files");
  const isRight = arrowDown.classList.contains("right");

  arrowDown.style.transform = isRight ? "rotate(0deg)" : "rotate(-90deg)";
  arrowDown.classList.toggle("right");
  files.style.display = isRight ? "block" : "none";
}

function changeSource(page) {
  const iframes = document.getElementsByTagName("iframe");
  const tabs = document.getElementById("tabs").children;

  Array.from(iframes).forEach((iframe) => {
    iframe.src = page;
  });

  const name =
    page.split(".html")[0].charAt(0).toUpperCase() +
    page.split(".html")[0].slice(1);

  const tabList = ["home", "about", "github", "projects", "contact", "404"];

  Array.from(tabs).forEach((tab) => {
    if (tab.id === `tab${name}`) {
      tab.classList.add("selected");
    } else {
      tab.classList.remove("selected");
    }
  });

  const pageButtons = document.getElementsByClassName("page-button");

  Array.from(pageButtons).forEach((button) => {
    if (button.id === `page${name}`) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}
