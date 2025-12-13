class MockP5 {
  image(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
