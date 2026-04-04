import HImage from "./HImage.js";

/**
 * Scene class
 */
export default class Scene {
  #objects;
  #objectsToAlwaysRedraw;
  #fullRedrawNeeded;
  #preSelectedObject;

  /**
   * The constructor
   */
  constructor() {
    this.#objects = [];
    this.#objectsToAlwaysRedraw = [];
    this.#fullRedrawNeeded = true;
  }

  /**
   * Inserts an object to scene
   * If object is always redrawn, adds it to the objects to always redraw
   * @param {SceneObject} object 
   * @param {boolean} isAlwaysRedrawn 
   */
  addObject(object, isAlwaysRedrawn = false) {
    this.#objects.push(object);

    if (isAlwaysRedrawn) {
      this.#objectsToAlwaysRedraw.push(object);
    }
    this.#fullRedrawNeeded = true;
  }

  /**
   * Removes an object from the scene and the objects to redraw.
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
    this.#fullRedrawNeeded = true;
  }

  /**
   * Updates the objects' position and size on canvas.
   * @param {number} scale 
   */
  update(scale) {
    this.#objects.forEach(object => object.update(scale));
    this.#fullRedrawNeeded = true;
  }

  /**
   * Draws the scene either fully or partially.
   * @param {p5} p5 
   */
  draw(p5) {
    if (this.#fullRedrawNeeded) {
      this.preSelect(p5.mouseX, p5.mouseY);
      this.#objects.forEach(object => object.draw(p5));
      this.#fullRedrawNeeded = false;
    } else {
      this.#objectsToAlwaysRedraw.forEach(object => object.draw(p5));
    }
  }

  /**
   * Find the object that the mouse is on top of and preselects it.
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
            this.#fullRedrawNeeded = true;
          }

          if (this.#preSelectedObject instanceof HImage) {
            this.#preSelectedObject.mouseExited();
            this.#fullRedrawNeeded = true;
          }
          this.#preSelectedObject = object;
        }
        break;
      }
    }

    if (!objectFound && this.#preSelectedObject) {
      if (this.#preSelectedObject instanceof HImage) {
        this.#preSelectedObject.mouseExited();
        this.#fullRedrawNeeded = true;
      }
      this.#preSelectedObject = null;
    }
  }
  
  /**
   * @returns the pre-selected object's on click message.
   */
  mouseClicked() {
    if (this.#preSelectedObject) {
      return this.#preSelectedObject.onClickMessage;
    }
    return "";
  }
}
