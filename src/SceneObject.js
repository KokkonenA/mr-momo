export default class SceneObject {
  #img;
  #sceneX;
  #sceneY;
  #sceneWidth;
  #sceneHeight;
  #x;
  #y;
  #width;
  #height;
  #onClickMessage;

  constructor(img, sceneX, sceneY, scale, onClickMessage) {
    this.#img = img;
    this.#x = this.#sceneX = sceneX;
    this.#y = this.#sceneY = sceneY;
    this.#width = this.#sceneWidth = scale * img.width;
    this.#height = this.#sceneHeight = scale * img.height;
    this.#onClickMessage = onClickMessage;
  }

  get img() {
    return this.#img;
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
   * @param {string} value
   */
  set message(value) {
    this.#onClickMessage = value;
  }

  // Update position and size on the canvas.
  update(scale) {
    this.#x = scale * this.#sceneX;
    this.#y = scale * this.#sceneY;
    this.#width = scale * this.#sceneWidth;
    this.#height = scale * this.#sceneHeight;
  }

  // Draw the image.
  // NOTE: for some objects it's overwritten in the setup.
  draw(p5) {
    p5.image(this.#img, this.#x, this.#y, this.#width, this.#height);
  }

  // Return true if mouse is over the image.
  // Return false otherwise.
  // NOTE: for some objects it's overwritten in the setup.
  isMouseOver(x, y) {
    return  x > this.#x && x < this.#x + this.#width &&
            y > this.#y && y < this.#y + this.#height;
  }

  // Return onClickMessage if mouse is over the image.
  mouseClicked(x, y) {
    if (this.isMouseOver(x, y)) {
      return this.#onClickMessage;
    }
    return "";
  }
}
