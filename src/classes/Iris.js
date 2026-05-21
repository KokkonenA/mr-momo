"use strict";

import Image from "./Image.js";

/**
 * Iris class.
 */
export default class Iris extends Image {
  /**
   * Draws the iris based on the mouse position.
   * 
   * @override
   * @param {p5} p5 
   */
  draw(p5) {
    const factor = 1000;
    const dx = (p5.mouseX - p5.width / 2) / factor;
    const dy = (p5.mouseY - p5.height / 2) / factor;
    p5.image(this.img, this.x + dx, this.y + dy, this.width, this.height);
  }
}
