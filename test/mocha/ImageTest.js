"use strict";

import { expect } from "chai";
import Image from "../../src/Image.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("Image", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      const img = new MockP5Image(1000, 500);
      const image = new Image(img, 1, 1, 1, "object clicked");
      image.draw(p5);
      expect(p5.imageCalls.length).to.equal(1);
      const imageCall = p5.imageCalls[0];
      expect(imageCall.img).to.equal(img);
      expect(imageCall.x).to.equal(image.x);
      expect(imageCall.y).to.equal(image.y);
      expect(imageCall.width).to.equal(image.width);
      expect(imageCall.height).to.equal(image.height);
      done();
    });
  });
});
