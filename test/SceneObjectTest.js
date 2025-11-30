"use strict";

import { expect } from 'chai';
import SceneObject from '../src/SceneObject.js';

class MockImage {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class MockP5 {
  image(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

describe("SceneObject", function() {
  let sceneObject;

  this.beforeEach(function() {
    const image = new MockImage(1000, 500);
    sceneObject = new SceneObject(image, 1, 1, 1, "object clicked");
  })

  describe("update", function() {
    it("should scale coordinates and dimensions", function(done) {
      sceneObject.update(2);
      expect(2, sceneObject.x);
      expect(2, sceneObject.y);
      expect(2, sceneObject.width);
      expect(2, sceneObject.height);
      done();
    })
  })

  describe("draw", function() {
    it("should call p5 image function with correct parameters when drawn.", function(done) {
      const p5 = new MockP5();
      sceneObject.draw(p5);
      expect(p5.img).to.equal(sceneObject.img);
      expect(p5.x).to.equal(sceneObject.x);
      expect(p5.y).to.equal(sceneObject.y);
      expect(p5.width).to.equal(sceneObject.width);
      expect(p5.height).to.equal(sceneObject.height);
      done();
    })
  })

  describe("isMouseOver", function() {
    it("should return true when given coordinates inside the object", function(done) {
      expect(sceneObject.isMouseOver(10, 10)).to.be.true;
      done();
    })
    it("should return false when given coordinates outside the object", function(done) {
      expect(sceneObject.isMouseOver(0, 0)).to.be.false;
      expect(sceneObject.isMouseOver(2000, 10)).to.be.false;
      expect(sceneObject.isMouseOver(10, 1000)).to.be.false;
      done();
    })
  })

  describe("mouseClicked", function() {
    it("should return onClickMessage when given coordinates inside the object", function(done) {
      expect(sceneObject.mouseClicked(10, 10)).to.equal("object clicked");
      done();
    })
    it("should return empty string when given coordinates outside the object", function(done) {
      expect(sceneObject.mouseClicked(0, 0)).to.equal("");
      done();
    })
  })
})
