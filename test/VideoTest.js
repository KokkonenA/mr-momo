"use strict";

import { expect } from "chai";
import { MockP5, MockP5MediaElement } from "./MockP5.js";
import Video from "../src/Video.js";

describe("Video", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      const vid = new MockP5MediaElement(1000, 500);
      const video = new Video(vid, 1, 1, 1, "object clicked");
      video.draw(p5);
      expect(p5.img).to.equal(vid);
      expect(p5.x).to.equal(video.x);
      expect(p5.y).to.equal(video.y);
      expect(p5.width).to.equal(video.width);
      expect(p5.height).to.equal(video.height);
      done();
    });
  });
});
