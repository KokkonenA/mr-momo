class SceneObject {
  constructor(img, x, y, scale, onClick) {
    img.resize(scale*img.width, scale*img.height)
    this.img = img;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.children = new Map();
    this.onClick = onClick;
  }

  // Add a child object.
  addChildObject(child, layer)
  {
    if (!this.children.has(layer)) {
      this.children.set(layer, []);
    }
    this.children.get(layer).push(child);
  }

  // Create a SceneObject and add it as a child
  // The position and scale of the child depends on the position and scale of the parent.
  addChild(img, x, y, scale, layer, onClick) {
    const child = new SceneObject(img, this.scale*x + this.x, this.scale*y + this.y, this.scale*scale, onClick);
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
  display() {
    image(this.img, this.x, this.y);
    this.children.forEach(layer => layer.forEach(child => child.display()));
  }

  // Return true if mouse is over the image.
  // Return false otherwise.
  // TO DO: Add the possibility for individual hit boxes. E.g. the letter under the table is very difficult to click atm.
  isMouseOver() {
    return  mouseX > this.x && mouseX < this.x + this.img.width &&
            mouseY > this.y && mouseY < this.y + this.img.height;
  }

  // Find the object that is being clicked and call OnClick() of that object.
  // Prioritize child over parent and higher layer over lower.
  mouseClicked() {
    let clickHandled = false;
    let childrenReversed = Array.from(this.children.entries()).reverse();

    loop:
    for (let [_, layer] of childrenReversed) {
      for (let child of layer) {
        clickHandled = child.mouseClicked();

        if (clickHandled) {
          break loop; // Break inner and outer loop.
        }
      }
    }

    if (!clickHandled && this.isMouseOver()) {
      this.onClick();
      clickHandled = true;
    }
    return clickHandled;
  }
}
