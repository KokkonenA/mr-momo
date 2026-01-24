import SceneObject from "./SceneObject.js";

export default class Video extends SceneObject {
  #vid

  constructor(vid, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*vid.width, scale*vid.height, onClickMessage);
    this.#vid = vid;
  }

  get vid() {
    return this.#vid;
  }

  // Play the video.
  play() {
    this.#vid.play();
  }

  // Loop the video.
  loop() {
    this.#vid.loop();
  }

  // Pause the video.
  pause() {
    this.#vid.pause();
  }

  // Stop the video.
  stop() {
    this.#vid.stop();
  }

  // Draw the current video frame.
  draw(p5) {
    p5.image(this.#vid, this.x, this.y, this.width, this.height);
  }
}
