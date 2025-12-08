/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a point is within range of a target
 * @param {number} x1 - Current X position
 * @param {number} y1 - Current Y position
 * @param {number} x2 - Target X position
 * @param {number} y2 - Target Y position
 * @param {number} threshold - Distance threshold
 * @returns {boolean} - True if within range
 */
function isWithinRange(x1, y1, x2, y2, threshold) {
  return Math.abs(x1 - x2) <= threshold && Math.abs(y1 - y2) <= threshold;
}

export default class Entity {
  static threshold = 6;
  static gameTime = 5;

  /**
   * @param {Object} config - Configuration object
   * @param {number} config.width - The width of the image in pixels
   * @param {number} config.height - The height of the image in pixels
   * @param {number} [config.x=0] - Starting X position
   * @param {number} [config.y=0] - Starting Y position
   * @param {Object.<string, string>} [config.imageState={}] - Object mapping state names to image URLs
   * @param {string} [config.className=""] - Class name for the entity
   * @param {string} [config.zIndex="5"] - Z-index for the entity
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
    this.entity = document.createElement("img");
    this.entity.className = className;
    this.entity.style.position = "absolute";
    this.entity.style.left = x + "px";
    this.entity.style.top = y + "px";
    this.entity.style.width = width + "px";
    this.entity.style.height = height + "px";
    this.entity.style.zIndex = zIndex;
    this.entity.style.pointerEvents = "none";
    this.entity.style.visibility = "hidden";
    this.entity.src = imageState.normal || "";
    this.imageState = imageState;
    document.body.appendChild(this.entity);
    // more here
  }

  /**
   * Get the middle position of the entity
   * @returns {{x: number, y: number}} - The center coordinates
   */
  getMiddlePos() {
    return {
      x: this.x_pos + Math.round(this.width / 2),
      y: this.y_pos + Math.round(this.height / 2),
    };
  }

  /**
   * @param {string} state - The state key to change the image to
   */
  setImageState(state) {
    if (this.imageState[state]) {
      this.entity.src = this.imageState[state];
      this.entity.style.visibility = "visible";
    }
  }

  /**
   * @param {number} locationX - Target X coordinate
   * @param {number} locationY - Target Y coordinate
   */
  moveTowardsLocation(locationX, locationY) {
    const vectorX = locationX - this.getMiddlePos().x;
    const vectorY = locationY - this.getMiddlePos().y;

    if (vectorX < 0) {
      this.entity.style.left = this.x_pos - 1 + "px";
      this.x_pos -= 1;
    } else if (vectorX > 0) {
      this.entity.style.left = this.x_pos + 1 + "px";
      this.x_pos += 1;
    }

    if (vectorY < 0) {
      this.entity.style.top = this.y_pos - 1 + "px";
      this.y_pos -= 1;
    } else if (vectorY > 0) {
      this.entity.style.top = this.y_pos + 1 + "px";
      this.y_pos += 1;
    }

    if (
      Math.abs(vectorX) <= Entity.threshold &&
      Math.abs(vectorY) <= Entity.threshold
    ) {
      // Not moving much, keep normal state
      this.setImageState("normal");
    } else if (Math.abs(vectorX) <= Entity.threshold) {
      // Moving primarily vertically
      if (vectorY > 0) {
        this.setImageState("down");
      } else {
        this.setImageState("up");
      }
    } else if (Math.abs(vectorY) <= Entity.threshold) {
      // Moving primarily horizontally
      if (vectorX > 0) {
        this.setImageState("right");
      } else {
        this.setImageState("left");
      }
    } else {
      if (vectorX > 0 && vectorY > 0) {
        this.setImageState("down_right");
      } else if (vectorX > 0 && vectorY < 0) {
        this.setImageState("up_right");
      } else if (vectorX < 0 && vectorY > 0) {
        this.setImageState("down_left");
      } else if (vectorX < 0 && vectorY < 0) {
        this.setImageState("up_left");
      }
    }
  }

  /**
   * Move to a specific location and wait until arrival
   * @param {number} x - Target X coordinate
   * @param {number} y - Target Y coordinate
   */
  async moveToLocation(x, y) {
    while (
      !isWithinRange(
        this.getMiddlePos().x,
        this.getMiddlePos().y,
        x,
        y,
        Entity.threshold
      )
    ) {
      this.moveTowardsLocation(x, y);
      await sleep(Entity.gameTime);
    }
  }
}
