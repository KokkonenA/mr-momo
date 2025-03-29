class SceneObject {
  constructor(img, x, y, scale) {
    img.resize(scale*img.width, scale*img.height)
    this.img = img;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.children = [];
  }

  // Add a child object for the SceneObject.
  // The position and scale of the child
  // depends on the position and scale of the parent.
  addChild(img, x, y, scale) {
    this.children.push(new SceneObject(img, this.scale*x + this.x, this.scale*y + this.y, this.scale*scale));
  }
  
  // Display the image and display the images of all children.
  display() {
    image(this.img, this.x, this.y);
    this.children.forEach(child => child.display());
  }
}
