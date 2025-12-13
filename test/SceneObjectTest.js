"use strict";

import { expect } from "chai";
import SceneObject from "../src/SceneObject.js";

describe("SceneObject", () => {
  let sceneObject;

  beforeEach(() => {
    sceneObject = new SceneObject(1, 1, 1000, 500, "object clicked");
  });

  describe("update", () => {
    it("should scale coordinates and dimensions", (done) => {
      sceneObject.update(2);
      expect(sceneObject.x).to.equal(2);
      expect(sceneObject.y).to.equal(2);
      expect(sceneObject.width).to.equal(2000);
      expect(sceneObject.height).to.equal(1000);
      done();
    })
  });

  describe("isMouseOver", () => {
    it("should return true when given coordinates inside the object", (done) => {
      expect(sceneObject.isMouseOver(10, 10)).to.be.true;
      done();
    });
    it("should return false when given coordinates outside the object", (done) => {
      expect(sceneObject.isMouseOver(0, 0)).to.be.false;
      expect(sceneObject.isMouseOver(2000, 10)).to.be.false;
      expect(sceneObject.isMouseOver(10, 1000)).to.be.false;
      done();
    });
  });

  describe("mouseClicked", () => {
    it("should return onClickMessage when given coordinates inside the object", (done) => {
      expect(sceneObject.mouseClicked(10, 10)).to.equal("object clicked");
      done();
    });
    it("should return empty string when given coordinates outside the object", (done) => {
      expect(sceneObject.mouseClicked(0, 0)).to.equal("");
      done();
    });
  });
});
