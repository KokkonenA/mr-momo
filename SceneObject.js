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

  // Add a child object for the SceneObject.
  // The position and scale of the child depends on the position and scale of the parent.
  addChild(img, x, y, scale, layer, onClick) {
    if (!this.children.has(layer)) {
      this.children.set(layer, []);
    }
    this.children.get(layer).push(new SceneObject(img, this.scale*x + this.x, this.scale*y + this.y, this.scale*scale, onClick));
  }
  
  // Display the image and display the images of all children in all layers.
  display() {
    image(this.img, this.x, this.y);
    this.children.forEach(layer => layer.forEach(child => child.display()));
  }

  // Return true if mouse in over the image.
  // Return false otherwise.
  // TO DO: Add the possibility for individual hit boxes. E.g. the letter under the table is very difficult to click atm.
  isMouseOver() {
    return  mouseX > this.x && mouseX < this.x + this.img.width &&
            mouseY > this.y && mouseY < this.y + this.img.height
  }

  // Find the object that is being clicked and perform the assigned action.
  // Prioritize child over parent and higher layer over lower.
  mouseClicked() {
    let clickHandled = false;
    let childrenReversed = Array.from(this.children.entries()).reverse();

    loop:
    for (let [_, children] of childrenReversed) {
      for (let child of children) {
        clickHandled = child.mouseClicked();

        if (clickHandled) {
          break loop; // break inner and outer loop
        }
      }
    }

    if (!clickHandled && this.isMouseOver()) {
      this.onClick();
      return true;
    }
    return clickHandled;
  }
}
