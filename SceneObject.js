export default class SceneObject {
  constructor(img, x, y, scale, onClickMessage) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = scale*img.width;
    this.height = scale*img.height;
    this.scale = scale;
    this.children = new Map();
    this.onClickMessage = onClickMessage;
  }

  // Add a child object.
  addChildObject(child, layer) {
    if (!this.children.has(layer)) {
      this.children.set(layer, []);
    }
    this.children.get(layer).push(child);
  }

  // Create a SceneObject and add it as a child.
  // The position and scale parameters are relative to the parent.
  addChild(img, relativeX, relativeY, relativeScale, layer, onClickMessage) {
    const child = new SceneObject(img, this.scale*relativeX + this.x, this.scale*relativeY + this.y, this.scale*relativeScale, onClickMessage);
    this.addChildObject(child, layer);
    return child;
  }

  // Remove a child.
  removeChild(child) {
    for (let layer of this.children.values()) {
      const index = layer.indexOf(child);

      if (index > -1) {
        layer.splice(index, 1);
        break;
      }
    }
  }
  
  // Display the image and display the images of all children in all layers.
  draw(p5) {
    p5.image(this.img, this.x, this.y, this.width, this.height);
    this.children.forEach(layer => layer.forEach(child => child.draw(p5)));
  }

  // Return true if mouse is over the image.
  // Return false otherwise.
  isMouseOver(x, y) {
    return  x > this.x && x < this.x + this.width &&
            y > this.y && y < this.y + this.height;
  }

  // Find the object that is being clicked and return onClickMessage of that object.
  // Prioritize child over parent and higher layer over lower.
  mouseClicked(x, y) {
    let message = "";
    let childrenReversed = Array.from(this.children.entries()).reverse();

    loop:
    for (let [_, layer] of childrenReversed) {
      for (let child of layer) {
        message = child.mouseClicked(x, y);

        if (message) {
          break loop; // Break both inner and outer loop.
        }
      }
    }

    if (!message && this.isMouseOver(x, y)) {
      message = this.onClickMessage;
    }
    return message;
  }

  // Update x, y, width, height and scale values by multiplying them with the coefficient value.
  windowResized(coefficient) {
    this.x = coefficient*this.x;
    this.y = coefficient*this.y;
    this.width = coefficient*this.width;
    this.height = coefficient*this.height;
    this.scale = coefficient*this.scale;

    this.children.forEach(layer => layer.forEach(child => child.windowResized(coefficient)));
  }
}
