"use strict";

import { expect } from "chai";
import Image from "../src/Image.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("Image", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      const img = new MockP5Image(1000, 500);
      const image = new Image(img, 1, 1, 1, "object clicked");
      image.draw(p5);
      expect(p5.img).to.equal(img);
      expect(p5.x).to.equal(image.x);
      expect(p5.y).to.equal(image.y);
      expect(p5.width).to.equal(image.width);
      expect(p5.height).to.equal(image.height);
      done();
    });
  });
});
