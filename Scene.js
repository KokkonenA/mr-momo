export default class Scene {
  #rootObject;
  #objectsToRedraw;
  #fullRedrawNeeded;

  constructor(rootObject) {
    this.#rootObject = rootObject;
    this.#objectsToRedraw = [];
    this.#fullRedrawNeeded = true;
  }

  get width() {
    return this.#rootObject.width;
  }

  // Draw an object.
  #drawObject(p5, object) {
    object.draw(p5)
  }

  // Add object to be redrawn.
  addObjectToBeRedrawn(object) {
    this.#objectsToRedraw.push(object);
  }

  // Add given object as a child of the root object.
  // If object is redrawn add it to objects to redraw.
  addObject(object, layer, isRedrawn) {
    this.#rootObject.addChildObject(object, layer);

    if (isRedrawn) {
        this.addObjectToBeRedrawn(object);
    }
    this.#fullRedrawNeeded = true;
  }

  // Remove object from root object's children
  // and objects to redraw.
  removeObject(object) {
    this.#rootObject.removeChild(object);

    const index = this.#objectsToRedraw.indexOf(object);

    if (index > -1) {
      this.#objectsToRedraw.splice(index, 1);
    }
    this.#fullRedrawNeeded = true;
  }

  // Redraw objects if necessary to the buffer
  // and raw the buffer on canvas.
  draw(p5) {
    if (this.#fullRedrawNeeded) {
      this.#drawObject(p5, this.#rootObject)
      this.#fullRedrawNeeded = false;
    }
    else {
      this.#objectsToRedraw.forEach(object => this.#drawObject(p5, object));
    }
  }

  // Handle mouse click.
  mouseClicked(x, y) {
    return this.#rootObject.mouseClicked(x, y);
  }

  // Handle window resized.
  windowResized(scale) {
    this.#rootObject.windowResized(scale);
    this.#fullRedrawNeeded = true;
  }
}
