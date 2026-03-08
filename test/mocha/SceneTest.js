"use strict";

import { expect } from "chai";
import SceneObject from "../../src/classes/SceneObject.js";
import Scene from "../../src/classes/Scene.js";

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
    let objectsDrawn;

    beforeEach(() => {
      sceneObject1.draw = (param) => param.object1DrawCount++;
      sceneObject2.draw = (param) => param.object2DrawCount++;
      objectsDrawn = {object1DrawCount: 0, object2DrawCount: 0};
    })

    it("should draw only objects to be always drawn after drawing everything.", (done) => {
      scene.draw(objectsDrawn);
      scene.draw(objectsDrawn);
      expect(objectsDrawn.object1DrawCount).to.equal(1);
      expect(objectsDrawn.object2DrawCount).to.equal(2);
      done();
    })

    it("should draw everything afer updating.", (done) => {
      scene.draw(objectsDrawn);
      scene.update(1);
      scene.draw(objectsDrawn);
      expect(objectsDrawn.object1DrawCount).to.equal(2);
      expect(objectsDrawn.object2DrawCount).to.equal(2);
      done();
    })

    it("should draw everything afer removing an object.", (done) => {
      scene.draw(objectsDrawn);
      scene.removeObject(sceneObject2);
      scene.draw(objectsDrawn);
      expect(objectsDrawn.object1DrawCount).to.equal(2);
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