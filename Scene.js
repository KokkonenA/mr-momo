export default class Scene {
    constructor(rootObject) {
        this.rootObject = rootObject;
    }

    // Draw the scene.
    draw(p5) {
        this.rootObject.draw(p5);
    }

    // Handle mouse clicked.
    mouseClicked(x, y) {
        this.rootObject.mouseClicked(x,y);
    }

    // Handle window resized.
    windowResized(newScale) {
        this.rootObject.windowResized(newScale);
    }
}
