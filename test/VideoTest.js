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
      expect(p5.imageCalls.length).to.equal(1);
      const imageCall = p5.imageCalls[0];
      expect(imageCall.img).to.equal(vid);
      expect(imageCall.x).to.equal(video.x);
      expect(imageCall.y).to.equal(video.y);
      expect(imageCall.width).to.equal(video.width);
      expect(imageCall.height).to.equal(video.height);
      done();
    });
  });
});
