"use strict";

import { expect } from "chai";
import Button from "../../src/classes/Button.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("Button", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      const img = new MockP5Image(1000, 500);
      const onHoverImg = new MockP5Image(1000, 500);
      const button = new Button(img, onHoverImg, 1, 1, 1, "object clicked");

      button.mouseEntered();
      button.draw(p5);
      button.mouseExited();
      button.draw(p5);

      expect(p5.imageCalls.length).to.equal(2);
      const firstImageCall = p5.imageCalls[0];
      const secondImageCall = p5.imageCalls[1];

      expect(firstImageCall.img).to.equal(onHoverImg);
      expect(firstImageCall.x).to.equal(button.x);
      expect(firstImageCall.y).to.equal(button.y);
      expect(firstImageCall.width).to.equal(button.width);
      expect(firstImageCall.height).to.equal(button.height);

      expect(secondImageCall.img).to.equal(img);
      expect(secondImageCall.x).to.equal(button.x);
      expect(secondImageCall.y).to.equal(button.y);
      expect(secondImageCall.width).to.equal(button.width);
      expect(secondImageCall.height).to.equal(button.height);
      done();
    });
  });
});
