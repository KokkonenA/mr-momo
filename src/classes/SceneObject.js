"use strict";

/**
 * Scene object class
 */
export default class SceneObject {
  #sceneX;
  #sceneY;
  #sceneWidth;
  #sceneHeight;
  #x;
  #y;
  #width;
  #height;

  /**
   * Constructor
   * 
   * @param {number} sceneX
   * @param {number} sceneY 
   * @param {number} sceneWidth 
   * @param {number} sceneHeight
   */
  constructor(sceneX, sceneY, sceneWidth, sceneHeight) {
    this.#x = this.#sceneX = sceneX;
    this.#y = this.#sceneY = sceneY;
    this.#width = this.#sceneWidth = sceneWidth;
    this.#height = this.#sceneHeight = sceneHeight;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  /**
   * Updates position and size on canvas.
   * 
   * @param {number} scale 
   */
  update(scale) {
    this.#x = scale * this.#sceneX;
    this.#y = scale * this.#sceneY;
    this.#width = scale * this.#sceneWidth;
    this.#height = scale * this.#sceneHeight;
  }

  /**
   * Defines how the object is drawn.
   */
  draw() {}

  /**
   * Defines what happens when the object is clicked.
   */
  click() {}

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns true if mouse is over the object, false otherwise
   */
  isMouseOver(x, y) {
    return  x > this.#x && x < this.#x + this.#width &&
            y > this.#y && y < this.#y + this.#height;
  }
}
