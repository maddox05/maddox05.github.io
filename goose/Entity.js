/**
 * Sprite names for the 8 compass directions, ordered by octant starting at
 * "pointing right" and rotating clockwise (screen space, so +y is down).
 * @type {string[]}
 */
const OCTANT_STATES = [
  "right",
  "down_right",
  "down",
  "down_left",
  "left",
  "up_left",
  "up",
  "up_right",
];

/**
 * Clamp a value into a range.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default class Entity {
  /** Distance in px at which a target counts as reached. */
  static threshold = 6;

  /**
   * @param {Object} config - Configuration object
   * @param {number} config.width - The width of the image in pixels
   * @param {number} config.height - The height of the image in pixels
   * @param {number} [config.x=0] - Starting X position (viewport coords)
   * @param {number} [config.y=0] - Starting Y position (viewport coords)
   * @param {Object.<string, string>} [config.imageState={}] - Object mapping state names to image URLs
   * @param {string} [config.className=""] - Class name for the entity
   * @param {string} [config.zIndex="9000"] - Z-index for the entity
   */
  constructor({
    width,
    height,
    x = 0,
    y = 0,
    imageState = {},
    className = "",
    zIndex = "9000",
  }) {
    this.x_pos = x;
    this.y_pos = y;
    this.width = width;
    this.height = height;
    this.imageState = imageState;
    /** Last direction sprite applied, so we only touch `src` on change. */
    this.currentState = "";

    this.entity = document.createElement("img");
    this.entity.className = className;
    this.entity.alt = "";
    // Fixed, not absolute: mouse events report viewport coordinates, so this
    // keeps the goose aimed correctly on a scrolled page.
    this.entity.style.position = "fixed";
    this.entity.style.left = "0px";
    this.entity.style.top = "0px";
    this.entity.style.width = width + "px";
    this.entity.style.height = height + "px";
    this.entity.style.zIndex = zIndex;
    this.entity.style.pointerEvents = "none";
    this.entity.style.visibility = "hidden";
    this.entity.style.willChange = "transform";
    this.entity.src = imageState.normal || "";
    this.setPosition(x, y);
    document.body.appendChild(this.entity);
  }

  /**
   * Move the sprite. Uses a transform so the browser can composite it without
   * a layout pass on every frame.
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.x_pos = x;
    this.y_pos = y;
    this.entity.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(
      y
    )}px, 0)`;
  }

  /**
   * Keep the entity inside the visible viewport.
   */
  clampToViewport() {
    this.setPosition(
      clamp(this.x_pos, 0, Math.max(0, window.innerWidth - this.width)),
      clamp(this.y_pos, 0, Math.max(0, window.innerHeight - this.height))
    );
  }

  /**
   * Get the middle position of the entity
   * @returns {{x: number, y: number}} - The center coordinates
   */
  getMiddlePos() {
    return {
      x: this.x_pos + this.width / 2,
      y: this.y_pos + this.height / 2,
    };
  }

  /**
   * Distance from this entity's centre to a point.
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  distanceTo(x, y) {
    const middle = this.getMiddlePos();
    return Math.hypot(x - middle.x, y - middle.y);
  }

  /**
   * @param {string} state - The state key to change the image to
   */
  setImageState(state) {
    if (state === this.currentState || !this.imageState[state]) {
      return;
    }
    this.currentState = state;
    this.entity.src = this.imageState[state];
  }

  show() {
    this.entity.style.visibility = "visible";
  }

  /**
   * Point the sprite along a movement vector, picking the nearest of the 8
   * directional images. Cheaper and more accurate than a chain of comparisons.
   * @param {number} vectorX
   * @param {number} vectorY
   */
  faceDirection(vectorX, vectorY) {
    if (Math.hypot(vectorX, vectorY) <= Entity.threshold) {
      this.setImageState("normal");
      return;
    }
    const angle = Math.atan2(vectorY, vectorX);
    const octant = (Math.round(angle / (Math.PI / 4)) + 8) % 8;
    this.setImageState(OCTANT_STATES[octant]);
  }

  /**
   * Step towards a target at a fixed speed, independent of frame rate.
   * @param {number} targetX - Target X coordinate (of the entity's centre)
   * @param {number} targetY - Target Y coordinate (of the entity's centre)
   * @param {number} dt - Seconds elapsed since the previous frame
   * @param {number} speed - Pixels per second
   * @returns {boolean} - True once the target has been reached
   */
  moveTowards(targetX, targetY, dt, speed) {
    const middle = this.getMiddlePos();
    const vectorX = targetX - middle.x;
    const vectorY = targetY - middle.y;
    const distance = Math.hypot(vectorX, vectorY);

    this.faceDirection(vectorX, vectorY);

    if (distance <= Entity.threshold) {
      return true;
    }

    // Normalising means diagonal travel is the same speed as axis travel, and
    // the final step never overshoots the target.
    const step = Math.min(speed * dt, distance);
    this.setPosition(
      this.x_pos + (vectorX / distance) * step,
      this.y_pos + (vectorY / distance) * step
    );
    return false;
  }

  /**
   * Remove the entity from the page.
   */
  destroy() {
    this.entity.remove();
  }
}
