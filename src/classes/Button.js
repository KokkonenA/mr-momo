import SceneObject from "./SceneObject.js";

export default class Button extends SceneObject {
  #img;
  #onHoverImg;
  #isHighlighted;

  constructor(img, onHoverImg, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*img.width, scale*img.height, onClickMessage);
    this.#img = img;
    this.#onHoverImg = onHoverImg
    this.#isHighlighted = false;
  }

  mouseEntered() {
    this.#isHighlighted = true;
  }

  mouseExited() {
    this.#isHighlighted = false;
  }

  // Draw the image
  draw(p5) {
    if (this.#isHighlighted) {
      p5.image(this.#onHoverImg, this.x, this.y, this.width, this.height);
    } else {
      p5.image(this.#img, this.x, this.y, this.width, this.height);
    }
  }
}