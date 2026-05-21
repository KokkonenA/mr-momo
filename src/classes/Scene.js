"use strict";

import HImage from "./HImage.js";

/**
 * Scene class
 */
export default class Scene {
  #objects;
  #objectsToAlwaysRedraw;
  #drawMode; // 0 = partial draw, 1 = full draw with preselection, 2 = full draw without preselection
  #preSelectedObject;

  constructor() {
    this.#objects = [];
    this.#objectsToAlwaysRedraw = [];
    this.#drawMode = 1;
  }

  /**
   * Inserts an object to scene.
   * If object is always redrawn, adds it to the objects to always redraw.
   * 
   * @param {SceneObject} object 
   * @param {boolean} isAlwaysRedrawn 
   */
  addObject(object, isAlwaysRedrawn = false) {
    this.#objects.push(object);

    if (isAlwaysRedrawn) {
      this.#objectsToAlwaysRedraw.push(object);
    }
    this.#drawMode = 1;
  }

  /**
   * Removes an object from the scene and the objects to redraw.
   * 
   * @param {SceneObject} object 
   */
  removeObject(object) {
    let index = this.#objects.indexOf(object);

    if (index > -1) {
      this.#objects.splice(index, 1);
    }

    index = this.#objectsToAlwaysRedraw.indexOf(object);

    if (index > -1) {
      this.#objectsToAlwaysRedraw.splice(index, 1);
    }
    this.#drawMode = 1;
  }

  /**
   * Updates the objects' position and size on canvas.
   * 
   * @param {number} scale 
   */
  update(scale) {
    this.#objects.forEach(object => object.update(scale));
    this.#drawMode = 1;
  }

  /**
   * Draws the scene.
   * 
   * @param {p5} p5 
   */
  draw(p5) {
    switch (this.#drawMode) {
      case 0:
        this.#objectsToAlwaysRedraw.forEach(object => object.draw(p5));
        break;
      case 1:
        this.preSelect(p5.mouseX, p5.mouseY);
        // FALL-THROUGH
      default:
        this.#objects.forEach(object => object.draw(p5));
        this.#drawMode = 0;
    }
  }

  /**
   * Finds the object that the mouse is on top of and preselects it.
   * 
   * @param {number} x 
   * @param {number} y 
   */
  preSelect(x, y) {
    let objectFound = false;

    for (let i = this.#objects.length - 1; i >= 0; i--) {
      const object = this.#objects[i];
      objectFound = object.isMouseOver(x, y);

      if (objectFound) {
        if (object != this.#preSelectedObject) {
          if (object instanceof HImage) {
            object.mouseEntered();
            this.#drawMode = 2;
          }

          if (this.#preSelectedObject instanceof HImage) {
            this.#preSelectedObject.mouseExited();
            this.#drawMode = 2;
          }
          this.#preSelectedObject = object;
        }
        break;
      }
    }

    if (!objectFound && this.#preSelectedObject) {
      if (this.#preSelectedObject instanceof HImage) {
        this.#preSelectedObject.mouseExited();
        this.#drawMode = 2;
      }
      this.#preSelectedObject = null;
    }
  }

  /**
   * Clicks the pre-selected object.
   */
  mouseClicked() {
    this.#preSelectedObject?.click();
  }
}
