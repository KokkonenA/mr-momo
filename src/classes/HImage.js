"use strict";

import SceneObject from "./SceneObject.js";

/**
 * Highlightable image scene object class
 */
export default class HImage extends SceneObject {
  #img;
  #onHoverImg;
  #isHighlighted;

  /**
   * The constructor
   * @param {p5.Image} img 
   * @param {p5.Image} onHoverImg 
   * @param {number} sceneX 
   * @param {number} sceneY 
   * @param {number} scale 
   * @param {string} onClickMessage 
   */
  constructor(img, onHoverImg, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*img.width, scale*img.height, onClickMessage);
    this.#img = img;
    this.#onHoverImg = onHoverImg
    this.#isHighlighted = false;
  }

  /**
   * Turns highlight on
   */
  mouseEntered() {
    this.#isHighlighted = true;
  }

  /**
   * Turns highlight off
   */
  mouseExited() {
    this.#isHighlighted = false;
  }
  /**
   * Draws the image
   * @param {p5} p5 
   */
  draw(p5) {
    if (this.#isHighlighted) {
      p5.image(this.#onHoverImg, this.x, this.y, this.width, this.height);
    } else {
      p5.image(this.#img, this.x, this.y, this.width, this.height);
    }
  }
}