import Entity from "./Entity.js";

/**
 * Behaviour tuning, mirroring Desktop Goose's config.ini knobs.
 * Wander times are shorter than the desktop original (10-20s) because a web
 * visit is shorter than a desktop session.
 */
const CONFIG = {
  minWanderTime: 2.5,
  maxWanderTime: 6,
  wanderSpeed: 90,
  chaseSpeed: 260,
  carrySpeed: 150,
  /** Odds of chasing the cursor rather than fetching a meme. */
  attackChance: 0.45,
  /** How long the goose sits on the cursor once it catches it. */
  snatchTime: 1.6,
  memeCount: 8,
  /** Dropped memes on screen before the oldest is cleaned up. */
  maxMemes: 4,
  gooseSize: 100,
  memeSize: 100,
};

const STATE = {
  WANDER: "wander",
  CHASE: "chase",
  FETCH: "fetch",
  CARRY: "carry",
  SNATCH: "snatch",
};

/**
 * Random float in [min, max).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * A random point inside the viewport, inset so the goose stays fully visible.
 * @param {number} inset
 * @returns {{x: number, y: number}}
 */
function randomPoint(inset) {
  return {
    x: randomRange(inset, Math.max(inset + 1, window.innerWidth - inset)),
    y: randomRange(inset, Math.max(inset + 1, window.innerHeight - inset)),
  };
}

/** @type {{stop: () => void} | null} Guards against double-starting. */
let running = null;

/**
 * Turn the goose loose. Safe to call more than once - later calls return the
 * handle to the goose that is already on screen.
 * @returns {{stop: () => void}}
 */
export function main() {
  if (running) {
    return running;
  }

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
    x: -CONFIG.gooseSize,
    y: window.innerHeight / 2,
    width: CONFIG.gooseSize,
    height: CONFIG.gooseSize,
    imageState: goose_images,
    zIndex: "91000",
  });
  goose.setImageState("normal");
  goose.show();

  let mouse_x = window.innerWidth / 2;
  let mouse_y = window.innerHeight / 2;

  /** @type {Entity[]} Memes currently lying on the page, oldest first. */
  const droppedMemes = [];
  /** @type {Entity | null} The meme the goose is holding, if any. */
  let heldMeme = null;

  let state = STATE.WANDER;
  /** Seconds left in the current state before it gives up or moves on. */
  let stateTimer = randomRange(CONFIG.minWanderTime, CONFIG.maxWanderTime);
  let target = randomPoint(CONFIG.gooseSize);
  let lastFrame = 0;
  let frameHandle = 0;

  /** @param {MouseEvent} e */
  function onMouseMove(e) {
    mouse_x = e.clientX;
    mouse_y = e.clientY;
  }

  function onResize() {
    goose.clampToViewport();
    for (const meme of droppedMemes) {
      meme.clampToViewport();
    }
  }

  function onVisibilityChange() {
    // Coming back from a hidden tab, drop the accumulated gap so the goose
    // does not teleport across the page in one frame.
    lastFrame = 0;
  }

  /**
   * Spawn a fresh meme just off the left edge, where the goose will collect it.
   * @returns {Entity}
   */
  function spawnMeme() {
    return new Entity({
      x: -CONFIG.memeSize,
      y: randomRange(0, Math.max(1, window.innerHeight - CONFIG.memeSize)),
      width: CONFIG.memeSize,
      height: CONFIG.memeSize,
      imageState: {
        // floor, not round: round would make Meme0 and Meme7 half as likely.
        normal: `/assets/goose_assets/memes/Meme${Math.floor(
          Math.random() * CONFIG.memeCount
        )}.png`,
      },
      className: "duck_meme",
      zIndex: "90999",
    });
  }

  /**
   * Pick the next thing to do once wandering runs out.
   */
  function chooseErrand() {
    if (Math.random() < CONFIG.attackChance) {
      state = STATE.CHASE;
      stateTimer = 6;
      return;
    }
    // Re-play with a meme already on the page instead of always fetching a
    // new one, which is what keeps the DOM from filling up with images.
    const existing = droppedMemes.length
      ? droppedMemes[Math.floor(Math.random() * droppedMemes.length)]
      : null;
    if (existing && Math.random() < 0.5) {
      heldMeme = existing;
      droppedMemes.splice(droppedMemes.indexOf(existing), 1);
      target = existing.getMiddlePos();
    } else {
      heldMeme = spawnMeme();
      target = heldMeme.getMiddlePos();
    }
    state = STATE.FETCH;
    stateTimer = 12;
  }

  /**
   * Drag the held meme along just ahead of the goose.
   */
  function dragHeldMeme() {
    if (!heldMeme) {
      return;
    }
    const middle = goose.getMiddlePos();
    heldMeme.setPosition(
      middle.x - heldMeme.width / 2 + CONFIG.gooseSize * 0.35,
      middle.y - heldMeme.height / 2
    );
  }

  function dropHeldMeme() {
    if (!heldMeme) {
      return;
    }
    heldMeme.clampToViewport();
    droppedMemes.push(heldMeme);
    heldMeme = null;
    while (droppedMemes.length > CONFIG.maxMemes) {
      const oldest = droppedMemes.shift();
      if (oldest) {
        oldest.destroy();
      }
    }
  }

  /**
   * Advance the behaviour state machine by one frame.
   * @param {number} dt - Seconds since the previous frame
   */
  function update(dt) {
    stateTimer -= dt;

    switch (state) {
      case STATE.WANDER: {
        const arrived = goose.moveTowards(
          target.x,
          target.y,
          dt,
          CONFIG.wanderSpeed
        );
        if (arrived) {
          // Idle on the spot until the wander timer expires, then commit.
          goose.setImageState("normal");
        }
        if (stateTimer <= 0) {
          chooseErrand();
        } else if (arrived && Math.random() < dt) {
          target = randomPoint(CONFIG.gooseSize);
        }
        break;
      }

      case STATE.CHASE: {
        // Live cursor position, so the goose actually tracks you instead of
        // walking to wherever the pointer happened to be at launch.
        const caught = goose.moveTowards(
          mouse_x,
          mouse_y,
          dt,
          CONFIG.chaseSpeed
        );
        if (caught) {
          state = STATE.SNATCH;
          stateTimer = CONFIG.snatchTime;
        } else if (stateTimer <= 0) {
          state = STATE.WANDER;
          stateTimer = randomRange(CONFIG.minWanderTime, CONFIG.maxWanderTime);
          target = randomPoint(CONFIG.gooseSize);
        }
        break;
      }

      case STATE.SNATCH: {
        // Sit on the cursor and honk about it.
        goose.moveTowards(mouse_x, mouse_y, dt, CONFIG.chaseSpeed);
        if (stateTimer <= 0) {
          state = STATE.WANDER;
          stateTimer = randomRange(CONFIG.minWanderTime, CONFIG.maxWanderTime);
          target = randomPoint(CONFIG.gooseSize);
        }
        break;
      }

      case STATE.FETCH: {
        if (!heldMeme) {
          state = STATE.WANDER;
          break;
        }
        const middle = heldMeme.getMiddlePos();
        const reached = goose.moveTowards(
          middle.x,
          middle.y,
          dt,
          CONFIG.chaseSpeed
        );
        if (reached || stateTimer <= 0) {
          heldMeme.show();
          state = STATE.CARRY;
          // Bring it to the cursor about half the time, otherwise somewhere
          // random - dropping it on the reader is the funnier half.
          target =
            Math.random() < 0.5
              ? { x: mouse_x, y: mouse_y }
              : randomPoint(CONFIG.memeSize);
          stateTimer = 12;
        }
        break;
      }

      case STATE.CARRY: {
        const delivered = goose.moveTowards(
          target.x,
          target.y,
          dt,
          CONFIG.carrySpeed
        );
        dragHeldMeme();
        if (delivered || stateTimer <= 0) {
          dropHeldMeme();
          state = STATE.WANDER;
          stateTimer = randomRange(CONFIG.minWanderTime, CONFIG.maxWanderTime);
          target = randomPoint(CONFIG.gooseSize);
        }
        break;
      }
    }
  }

  /**
   * @param {number} now - High resolution timestamp from requestAnimationFrame
   */
  function frame(now) {
    frameHandle = requestAnimationFrame(frame);
    if (!lastFrame) {
      lastFrame = now;
      return;
    }
    // Cap dt so a stalled tab or a slow frame cannot teleport the goose.
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    update(dt);
  }

  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibilityChange);
  frameHandle = requestAnimationFrame(frame);

  running = {
    stop() {
      cancelAnimationFrame(frameHandle);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (heldMeme) {
        heldMeme.destroy();
        heldMeme = null;
      }
      for (const meme of droppedMemes) {
        meme.destroy();
      }
      droppedMemes.length = 0;
      goose.destroy();
      running = null;
    },
  };
  return running;
}
