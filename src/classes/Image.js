"use strict";

import SceneObject from "./SceneObject.js";

/**
 * Image scene object class
 */
export default class Image extends SceneObject {
  #img;

  /**
   * The constructor
   * @param {p5.Image} img 
   * @param {number} sceneX 
   * @param {number} sceneY 
   * @param {number} scale 
   * @param {string} onClickMessage 
   */
  constructor(img, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*img.width, scale*img.height, onClickMessage);
    this.#img = img;
  }

  get img() {
    return this.#img;
  }

  /**
   * Draws the image
   * @param {p5} p5 
   */
  draw(p5) {
    p5.image(this.#img, this.x, this.y, this.width, this.height);
  }
}
