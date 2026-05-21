"use strict";

import SceneObject from "./SceneObject.js";

/**
 * Image scene object class
 */
export default class Image extends SceneObject {
  #img;

  /**
   * @param {p5.Image} img 
   * @param {number} sceneX 
   * @param {number} sceneY 
   * @param {number} scale
   */
  constructor(img, sceneX, sceneY, scale) {
    super(sceneX, sceneY, scale*img.width, scale*img.height);
    this.#img = img;
  }

  get img() {
    return this.#img;
  }

  /**
   * Draws the image
   * 
   * @override
   * @param {p5} p5 
   */
  draw(p5) {
    p5.image(this.#img, this.x, this.y, this.width, this.height);
  }
}
