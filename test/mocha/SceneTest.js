"use strict";

import { expect } from "chai";
import HImage from "../../src/classes/HImage.js";
import SceneObject from "../../src/classes/SceneObject.js";
import Scene from "../../src/classes/Scene.js";
import { MockP5, MockP5Image } from "./MockP5.js";

describe("Scene", () => {
  let scene;
  let sceneObject1;
  let sceneObject2;

  beforeEach(() => {
    scene = new Scene();
    sceneObject1 = new SceneObject(1, 1, 1000, 500, "object 1 clicked");
    sceneObject2 = new SceneObject(200, 200, 200, 200, "object 2 clicked");
    scene.addObject(sceneObject1);
    scene.addObject(sceneObject2, true);
  });

  describe("update", () => {
    it("should scale coordinates and dimensions of its objects", (done) => {
      scene.update(2);

      expect(sceneObject1.x).to.equal(2);
      expect(sceneObject1.y).to.equal(2);
      expect(sceneObject1.width).to.equal(2000);
      expect(sceneObject1.height).to.equal(1000);

      expect(sceneObject2.x).to.equal(400);
      expect(sceneObject2.y).to.equal(400);
      expect(sceneObject2.width).to.equal(400);
      expect(sceneObject2.height).to.equal(400);

      done();
    })
  })

  describe("addObject", () => {
    it("should add an object to the scene.", (done) => {
      const sceneObject3 = new SceneObject(250, 250, 200, 200, "object 3 clicked");
      scene.addObject(sceneObject3);
      scene.update(2);

      expect(sceneObject3.x).to.equal(500);
      expect(sceneObject3.y).to.equal(500);
      expect(sceneObject3.width).to.equal(400);
      expect(sceneObject3.height).to.equal(400);

      done();
    })
  })

  describe("removeObject", () => {
    it("should remove object from the scene.", (done) => {
      scene.removeObject(sceneObject2);
      scene.update(2);

      expect(sceneObject1.x).to.equal(2);
      expect(sceneObject1.y).to.equal(2);
      expect(sceneObject1.width).to.equal(2000);
      expect(sceneObject1.height).to.equal(1000);

      expect(sceneObject2.x).to.equal(200);
      expect(sceneObject2.y).to.equal(200);
      expect(sceneObject2.width).to.equal(200);
      expect(sceneObject2.height).to.equal(200);

      done();
    })
  })
  
  describe("draw", () => {
    let p5;
    let object1DrawCount;
    let object2DrawCount;

    beforeEach(() => {
      p5 = new MockP5();
      p5.mouseX = 0;
      p5.mouseY = 0;
      sceneObject1.draw = () => object1DrawCount++;
      sceneObject2.draw = () => object2DrawCount++;
      object1DrawCount = 0;
      object2DrawCount = 0;
    })

    it("should draw only objects to be always drawn after drawing everything.", (done) => {
      scene.draw(p5);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(1);
      expect(object2DrawCount).to.equal(2);
      done();
    })

    it("should draw everything afer updating.", (done) => {
      scene.draw(p5);
      scene.update(1);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(2);
      expect(object2DrawCount).to.equal(2);
      done();
    })

    it("should draw everything afer adding an object.", (done) => {
      let object3DrawCount = 0;
      const sceneObject3 = new SceneObject(250, 250, 200, 200, "object 3 clicked");
      sceneObject3.draw = () => object3DrawCount++;
      scene.draw(p5);
      scene.addObject(sceneObject3);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(2);
      expect(object2DrawCount).to.equal(2);
      expect(object3DrawCount).to.equal(1);
      done();
    })

    it("should draw everything afer removing an object.", (done) => {
      scene.draw(p5);
      scene.removeObject(sceneObject2);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(2);
      expect(object2DrawCount).to.equal(1);
      done();
    })

    it("should draw everything afer moving mouse on and off a highlightable image.", (done) => {
      let object3DrawCount = 0;
      const sceneObject3 = new HImage(new MockP5Image(100, 100), new MockP5Image(100, 100), 250, 250, 1, "HImage clicked");
      sceneObject3.draw = () => object3DrawCount++;
      scene.addObject(sceneObject3);
      scene.draw(p5);
      p5.mouseX = 300;
      p5.mouseY = 300;
      scene.preSelect(p5.mouseX, p5.mouseY);
      scene.draw(p5);
      p5.mouseX = 50;
      p5.mouseY = 50;
      scene.preSelect(p5.mouseX, p5.mouseY);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(3);
      expect(object2DrawCount).to.equal(3);
      expect(object3DrawCount).to.equal(3);
      done();
    })

    it("should not draw everything afer moving mouse on and off an image.", (done) => {
      scene.draw(p5);
      p5.mouseX = 50;
      p5.mouseY = 50;
      scene.preSelect(p5.mouseX, p5.mouseY);
      scene.draw(p5);
      p5.mouseX = 200;
      p5.mouseY = 200;
      scene.preSelect(p5.mouseX, p5.mouseY);
      scene.draw(p5);
      expect(object1DrawCount).to.equal(1);
      expect(object2DrawCount).to.equal(3);
      done();
    })
  })

  describe("preSelect", () => {
    it("should call mouseEntered of an HImage when mouse enters and mouseExited when mouse exits.", (done) => {
      const sceneObject = new HImage(new MockP5Image(100, 100), new MockP5Image(100, 100), 250, 250, 1, "HImage clicked");

      let mouseEnteredCount = 0;
      let mouseExitedCount = 0;

      sceneObject.mouseEntered = () => { mouseEnteredCount++ };
      sceneObject.mouseExited = () => { mouseExitedCount++ };
      scene.addObject(sceneObject);
      scene.preSelect(300, 300);
      scene.preSelect(200, 200);
      expect(mouseEnteredCount).to.equal(1);
      expect(mouseExitedCount).to.equal(1);
      done();
    })
  })

  describe("mouseClicked", () => {
    it("should return the onClickMessage of the topmost object after mouse has moved.", (done) => {
      expect(scene.mouseClicked()).to.equal("")
      scene.preSelect(100, 100);
      expect(scene.mouseClicked()).to.equal("object 1 clicked");
      scene.preSelect(300, 300);
      expect(scene.mouseClicked()).to.equal("object 2 clicked");
      done();
    })
  })
})
