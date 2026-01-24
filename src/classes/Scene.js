import Image from "./Image.js";

export default class Scene {
  #objects;
  #objectsToAlwaysRedraw;
  #fullRedrawNeeded;
  #preSelectedObject;

  constructor() {
    this.#objects = [];
    this.#objectsToAlwaysRedraw = [];
    this.#fullRedrawNeeded = true;
  }

  // Insert an object to scene.
  // If object is always redrawn add it to objects to always redraw.
  addObject(object, isAlwaysRedrawn = false) {
    this.#objects.push(object);

    if (isAlwaysRedrawn) {
      this.#objectsToAlwaysRedraw.push(object);
    }
    this.#fullRedrawNeeded = true;
  }

  // Remove object from the scene and objects to redraw.
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

  // Update objects' position and size on canvas.
  update(scale) {
    this.#objects.forEach(object => object.update(scale));
    this.#fullRedrawNeeded = true;
  }

  // Draw either fully or partially.
  draw(p5) {
    if (this.#fullRedrawNeeded) {
      this.#objects.forEach(object => object.draw(p5));
      this.#fullRedrawNeeded = false;
    } else {
      this.#objectsToAlwaysRedraw.forEach(object => object.draw(p5));
    }
  }

  // Find the object that the mouse is over.
  mouseMoved(x, y) {
    for (let i = this.#objects.length - 1; i >= 0; i--) {
      const object = this.#objects[i];

      if (object.isMouseOver(x, y)) {
        if (object != this.#preSelectedObject) {
          if (object instanceof Image) {
            object.mouseEntered();
          }

          if (this.#preSelectedObject instanceof Image) {
            this.#preSelectedObject.mouseExited();
          }
          this.#fullRedrawNeeded = true;
          this.#preSelectedObject = object;
        }
        break;
      }
    }
  }

  // Find the object that is being clicked and return onClickMessage of that object.
  mouseClicked(x, y) {
    let message = "";

    for (let i = this.#objects.length - 1; i >= 0; i--) {
      const object = this.#objects[i];
      message = object.mouseClicked(x, y);

      if (message) {
        break;
      }
    }
    return message;
  }
}
