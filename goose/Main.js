import Entity from "./Entity.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @param {HTMLImageElement} selectedElement
 */
function querySelectorToEntity(selectedElement) {
  return new Entity({
    width: parseInt(selectedElement.style.width),
    height: parseInt(selectedElement.style.height),
    imageState: {
      normal: selectedElement.src,
    },
  });
}

export async function main() {
  let paused = false;

  const goose_images = {
    normal: "/assets/goose_assets/duck_right.png",
    up: "/assets/goose_assets/duck_up.png",
    down: "/assets/goose_assets/duck_down.png",
    right: "/assets/goose_assets/duck_right.png",
    left: "/assets/goose_assets/duck_left.png",
    up_left: "/assets/goose_assets/duck_up_left.png",
    up_right: "/assets/goose_assets/duck_up_right.png",
    down_left: "/assets/goose_assets/duck_down_left.png",
    down_right: "/assets/goose_assets/duck_down_right.png",
  };

  const goose = new Entity({
    width: 100,
    height: 100,
    imageState: goose_images,
    zIndex: "91000",
  });
  let mouse_x = 0;
  let mouse_y = 0;
  document.addEventListener("mousemove", (e) => {
    mouse_y = e.clientY;
    mouse_x = e.clientX;
  });
  /**
   * @param {Entity | null} meme
   */
  async function playWithMeme(meme) {
    if (!meme) {
      return;
    }
    meme.setImageState("normal");
    await goose.moveToLocation(meme.x_pos, meme.y_pos);
    // goose and meme move to cursor at same time
    await Promise.all([
      goose.moveToLocation(mouse_x, mouse_y),
      meme.moveToLocation(mouse_x, mouse_y),
    ]);
  }

  async function getMemeFromOffScreen() {
    paused = true;
    const meme = new Entity({
      x: 15,
      y: Math.random() * window.innerHeight,
      width: 100,
      height: 100,
      imageState: {
        normal: `/assets/goose_assets/memes/Meme${Math.round(
          Math.random() * 7
        )}.png`,
      },
      className: "duck_meme",
    });
    await goose.moveToLocation(meme.x_pos, meme.y_pos);
    meme.setImageState("normal");

    paused = false;
  }
  goose.setImageState("normal");
  while (true) {
    if (paused) {
      await sleep(Entity.gameTime);
      continue;
    }
    goose.moveTowardsLocation(mouse_x, mouse_y);
    if (Math.random() < 0.5) {
      console.log("getting meme");
      await getMemeFromOffScreen();
    }
    let query_meme = document.querySelector(".duck_meme");
    if (Math.random() < 0.5 && query_meme) {
      console.log("play with meme");
      console.log(query_meme);
      document.body.removeChild(query_meme);

      await playWithMeme(
        querySelectorToEntity(/** @type {HTMLImageElement} */ (query_meme))
      );
    }
    await sleep(Entity.gameTime);
  }
}
