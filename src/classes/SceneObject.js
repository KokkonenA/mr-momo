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
  #onClickMessage;

  /**
   * The constructor
   * @param {number} sceneX
   * @param {number} sceneY 
   * @param {number} sceneWidth 
   * @param {number} sceneHeight 
   * @param {string} onClickMessage 
   */
  constructor(sceneX, sceneY, sceneWidth, sceneHeight, onClickMessage) {
    this.#x = this.#sceneX = sceneX;
    this.#y = this.#sceneY = sceneY;
    this.#width = this.#sceneWidth = sceneWidth;
    this.#height = this.#sceneHeight = sceneHeight;
    this.#onClickMessage = onClickMessage;
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

  get onClickMessage() {
    return this.#onClickMessage;
  }

  /**
   * @param {string} value
   */
  set onClickMessage(value) {
    this.#onClickMessage = value;
  }

  /**
   * Updates position and size on the canvas
   * @param {number} scale 
   */
  update(scale) {
    this.#x = scale * this.#sceneX;
    this.#y = scale * this.#sceneY;
    this.#width = scale * this.#sceneWidth;
    this.#height = scale * this.#sceneHeight;
  }

  /**
   * Abstract - Draws the object
   */
  draw() {
    throw new Error("Method 'draw' must be implemented.");
  }

  /**
   * NOTE: for some objects this is overwritten in the setup
   * @param {number} x 
   * @param {number} y 
   * @returns true if mouse is over the image, false otherwise
   */
  isMouseOver(x, y) {
    return  x > this.#x && x < this.#x + this.#width &&
            y > this.#y && y < this.#y + this.#height;
  }
}
