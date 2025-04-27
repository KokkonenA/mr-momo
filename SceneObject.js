export default class SceneObject {
  constructor(img, x, y, scale, onClick) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = scale*img.width;
    this.height = scale*img.height;
    this.scale = scale;
    this.children = new Map();
    this.onClick = onClick;
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
  addChild(img, relativeX, relativeY, relativeScale, layer, onClick) {
    const child = new SceneObject(img, this.scale*relativeX + this.x, this.scale*relativeY + this.y, this.scale*relativeScale, onClick);
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
  // TO DO: Add the possibility for individual hit boxes. E.g. the letter under the table is very difficult to click atm.
  isMouseOver(x, y) {
    return  x > this.x && x < this.x + this.width &&
            y > this.y && y < this.y + this.height;
  }

  // Find the object that is being clicked and call OnClick() of that object.
  // Prioritize child over parent and higher layer over lower.
  mouseClicked(x, y) {
    let clickHandled = false;
    let childrenReversed = Array.from(this.children.entries()).reverse();

    loop:
    for (let [_, layer] of childrenReversed) {
      for (let child of layer) {
        clickHandled = child.mouseClicked(x, y);

        if (clickHandled) {
          break loop; // Break both inner and outer loop.
        }
      }
    }

    if (!clickHandled && this.isMouseOver(x, y)) {
      this.onClick();
      clickHandled = true;
    }
    return clickHandled;
  }

  // Update x, y, width, height and scale values based on the new scale.
  windowResized(newScale) {
    this.x = newScale/this.scale*this.x;
    this.y = newScale/this.scale*this.y;
    this.width = newScale*this.img.width;
    this.height = newScale*this.img.height;
    this.scale = newScale;
    
    this.children.forEach(layer => layer.forEach(child => child.windowResized(newScale)));
  }
}
