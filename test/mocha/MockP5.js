class MockP5 {
  #imageCalls;

  constructor() {
    this.#imageCalls = [];
  }

  get imageCalls() {
    return this.#imageCalls;
  }

  image(img, x, y, width, height) {
    this.#imageCalls.push({img: img, x: x, y: y, width: width, height: height});
  }
}

class MockP5Image {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class MockP5MediaElement {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

export { MockP5, MockP5Image, MockP5MediaElement };
