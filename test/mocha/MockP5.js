/**
 * Mock p5 class
 */
class MockP5 {
  #mouseX;
  #mouseY;
  #imageCalls;

  /**
   * The constructor
   */
  constructor() {
    this.#imageCalls = [];
  }

  get mouseX() {
    return this.#mouseX;
  }
  
  /**
   * @param {number} value 
   */
  set mouseX(value) {
    this.#mouseX = value;
  }

  get mouseY() {
    return this.#mouseY;
  }

  /**
   * @param {number} value
   */
  set mouseY(value) {
    this.#mouseY = value;
  }

  get imageCalls() {
    return this.#imageCalls;
  }

  /**
   * Stores parameters of the calls to the image calls.
   * @param {MockP5Image} img 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  image(img, x, y, width, height) {
    this.#imageCalls.push({img: img, x: x, y: y, width: width, height: height});
  }
}

/**
 * Mock p5.Image class
 */
class MockP5Image {
  #width;
  #height;

  /**
   * @param {number} width 
   * @param {number} height 
   */
  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }
}

/**
 * Mock p5.MediaElement class
 */
class MockP5MediaElement {
  #width;
  #height;

  /**
   * The constructor
   * @param {number} width 
   * @param {number} height 
   */
  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height;
  }
}

export { MockP5, MockP5Image, MockP5MediaElement };
