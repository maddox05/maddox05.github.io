fetch("https://api.github.com/users/maddox05/repos")
  .then((response) => response.json())
    .then((data) => {
    document.getElementById("repos").innerText = `${data.length} repositories`;
  });

fetch("https://api.github.com/users/maddox05/followers")
  .then((response) => response.json())
    .then((data) => {
    document.getElementById("followers").innerText = `${data.length} followers`;
  });
