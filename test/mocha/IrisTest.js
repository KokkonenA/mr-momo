"use strict";

import { expect } from "chai";
import Iris from "../../src/classes/Iris.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("Iris", () => {
  describe("draw", () => {
    it("should call p5 image function with correct parameters.", (done) => {
      const p5 = new MockP5();
      p5.mouseX = 1;
      p5.mouseY = 1;
      p5.width = 10;
      p5.height = 10;
      const img = new MockP5Image(1000, 500);
      const iris = new Iris(img, 5, 5, 1);
      iris.draw(p5);
      expect(p5.imageCalls.length).to.equal(1);
      const imageCall = p5.imageCalls[0];
      expect(imageCall.img).to.equal(img);
      expect(imageCall.x).to.equal(4.996);
      expect(imageCall.y).to.equal(4.996);
      expect(imageCall.width).to.equal(iris.width);
      expect(imageCall.height).to.equal(iris.height);
      done();
    });
  });
});