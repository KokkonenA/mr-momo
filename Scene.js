export default class Scene {
  #objects;
  #objectsToRedraw;
  #fullRedrawNeeded;

  constructor() {
    this.#objects = [];
    this.#objectsToRedraw = [];
    this.#fullRedrawNeeded = true;
  }

  // Insert an object to scene.
  // If object is redrawn add it to objects to redraw.
  addObject(object, isRedrawn = false) {
    this.#objects.push(object);

    if (isRedrawn) {
      this.#objectsToRedraw.push(object);
    }
    this.#fullRedrawNeeded = true;
  }

  // Remove object from the scene and objects to redraw.
  removeObject(object) {
    let index = this.#objects.indexOf(object);

    if (index > -1) {
      this.#objects.splice(index, 1);
    }

    index = this.#objectsToRedraw.indexOf(object);

    if (index > -1) {
      this.#objectsToRedraw.splice(index, 1);
    }
    this.#fullRedrawNeeded = true;
  }

  // Update objects' position and size on canvas.
  update(scale) {
    this.#objects.forEach(object => object.update(scale));
    this.#fullRedrawNeeded = true;
  }

  // Redraw either fully or partially.
  draw(p5) {
    if (this.#fullRedrawNeeded) {
      this.#objects.forEach(object => object.draw(p5));
      this.#fullRedrawNeeded = false;
    } else {
      this.#objectsToRedraw.forEach(object => object.draw(p5));
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
