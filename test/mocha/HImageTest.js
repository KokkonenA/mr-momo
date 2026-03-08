"use strict";

import { expect } from "chai";
import HImage from "../../src/classes/HImage.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("HImage", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      const img = new MockP5Image(1000, 500);
      const onHoverImg = new MockP5Image(1000, 500);
      const hImage = new HImage(img, onHoverImg, 1, 1, 1, "object clicked");

      hImage.mouseEntered();
      hImage.draw(p5);
      hImage.mouseExited();
      hImage.draw(p5);

      expect(p5.imageCalls.length).to.equal(2);
      const firstImageCall = p5.imageCalls[0];
      const secondImageCall = p5.imageCalls[1];

      expect(firstImageCall.img).to.equal(onHoverImg);
      expect(firstImageCall.x).to.equal(hImage.x);
      expect(firstImageCall.y).to.equal(hImage.y);
      expect(firstImageCall.width).to.equal(hImage.width);
      expect(firstImageCall.height).to.equal(hImage.height);

      expect(secondImageCall.img).to.equal(img);
      expect(secondImageCall.x).to.equal(hImage.x);
      expect(secondImageCall.y).to.equal(hImage.y);
      expect(secondImageCall.width).to.equal(hImage.width);
      expect(secondImageCall.height).to.equal(hImage.height);
      done();
    });
  });
});
