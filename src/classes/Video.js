"use strict";

import SceneObject from "./SceneObject.js";

const videoWidth = 1920;
const videoHeight = 1080;

/**
 * Video scene object class
 */
class Video extends SceneObject {
  #vid

  /**
   * The constructor
   * @param {p5.MediaElement} vid 
   * @param {number} sceneX 
   * @param {number} sceneY 
   * @param {number} scale 
   * @param {string} onClickMessage 
   */
  constructor(vid, sceneX, sceneY, scale, onClickMessage) {
    super(sceneX, sceneY, scale*videoWidth, scale*videoHeight, onClickMessage);
    this.#vid = vid;
  }

  get vid() {
    return this.#vid;
  }

  /**
   * Plays the video.
   */
  play() {
    this.#vid.play();
  }

  /**
   * Loops the video.
   */
  loop() {
    this.#vid.loop();
  }

  /**
   * Pauses the video.
   */
  pause() {
    this.#vid.pause();
  }

  /**
   * Stops the video.
   */
  stop() {
    this.#vid.stop();
  }

  /**
   * Draws the current video frame.
   * @param {p5} p5 
   */
  draw(p5) {
    p5.image(this.#vid, this.x, this.y, this.width, this.height);
  }
}

export { videoWidth, videoHeight, Video };