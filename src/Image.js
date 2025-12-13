import SceneObject from "./SceneObject.js";

export default class Image extends SceneObject {
  #img;

  constructor(img, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*img.width, scale*img.height, onClickMessage);
    this.#img = img;
  }

  get img() {
    return this.#img;
  }

  // Draw the image
  draw(p5) {
    p5.image(this.#img, this.x, this.y, this.width, this.height);
  }
}
