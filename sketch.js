import SceneObject from "./SceneObject.js";

new p5((p5) => {
  const images = new Map();

  let room;
  let invisibleLayer; // Invisible image between the main scene and a pop up image
  let birthdayDrawing;
  let popupImage;

  // Load assets. By doing this in the preload we can be sure that everything is loaded when the setup starts.
  p5.preload = () => {
    p5.loadJSON("fileList.json", (imagePaths) => {
      for (let path of imagePaths)
      {
        images.set(path, p5.loadImage(path));
      }
    });
  }

  p5.setup = () => {
    // Calculate the canvas size and position based on dimensions of the background image.
    // The background image should fill the whole canvas.
    // The canvas should be centered and fill as much of the window as possible.
    const backgroundImg = images.get("assets/walls.png");
    const windowImageWidthRelation = p5.windowWidth / backgroundImg.width;
    const windowImageHeightRelation = p5.windowHeight / backgroundImg.height;

    if (windowImageWidthRelation < windowImageHeightRelation) {
      var backgroundScale = windowImageWidthRelation;
      var canvasX = 0;
      var canvasY = (p5.windowHeight - backgroundScale * backgroundImg.height) / 2;
    }
    else {
      var backgroundScale = windowImageHeightRelation;
      var canvasX = (p5.windowWidth - backgroundScale * backgroundImg.width) / 2;
      var canvasY = 0;
    }

    // Create the canvas and position it based on the calculations earlier.
    const canvas = p5.createCanvas(backgroundScale*backgroundImg.width, backgroundScale*backgroundImg.height);
    canvas.position(canvasX, canvasY);

    // Create a root object (the background) and add other scene objects as its children.
    // The images that should be on top should have a higher layer number.
    room = new SceneObject(backgroundImg, 0, 0, backgroundScale, () => console.log("background"));
    room.addChild(images.get("assets/cake.png"), 1500, 1100, 1, 0, onClickCake);
    room.addChild(images.get("assets/rug.png"), 2900, 1000, 1, 0, () => console.log("rug"));
    room.addChild(images.get("assets/cigarettes.png"), 3200, 1400, 1, 1, () => console.log("cigarettes"));
    room.addChild(images.get("assets/r_u_ok.png"), 3380, 1600, 1, 1, () => console.log("rUOk"));

    const foodBowl = room.addChild(images.get("assets/dog_food.png"), 3200, 1600, 1, 2, () => console.log("dogFood"));
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.img.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.img.height;
    }

    room.addChild(images.get("assets/used_condom.png"), 3300, 2000, 1, 0, () => console.log("condom"));
    room.addChild(images.get("assets/mr.momo.png"), 1500, 1600, 1, 0, () => console.log("mrMomo"));
    room.addChild(images.get("assets/old_tv.png"), 900, 500, 1, 0, () => console.log("oldTv"));
    room.addChild(images.get("assets/orange.png"), 500, 1900, 1, 0, () => console.log("orange"));
    room.addChild(images.get("assets/pizza_box.png"), 3400, 700, 1, 1, () => console.log("pizzaBox"));
    room.addChild(images.get("assets/letter.png"), 2700, 1000, 1, 0, () => console.log("letter"));

    const table = room.addChild(images.get("assets/table.png"), 2200, 700, 1, 1, () => console.log("table"));
    table.isMouseOver = () => { return false };

    room.addChild(images.get("assets/cd_player.png"), 2300, 800, 1, 2, () => console.log("cdPlayer"));
    room.addChild(images.get("assets/tea_mug.png"), 1800, 1000, 1, 0, () => console.log("teaMug"));
    room.addChild(images.get("assets/portrait.png"), 2900, 130, 1, 0, () => console.log("portrait"));

    const invisibleLayerImg = p5.createImage(p5.width, p5.height);
    invisibleLayer = new SceneObject(invisibleLayerImg, 0, 0, 0, onClickInvisibleLayer);

    const birthdayImg = images.get("assets/zoomed_images/birthday.png")
    const birthdayImgScale = p5.height / birthdayImg.height;
    const birthdayImgX = p5.width / 2 - birthdayImgScale*birthdayImg.width/2;
    const birthdayImgY = 0;
    birthdayDrawing = new SceneObject(birthdayImg, birthdayImgX, birthdayImgY, birthdayImgScale, () => console.log("birthday"));
  }

  p5.draw = () => {
    room.display(p5);
  }

  p5.mouseClicked = () => {
    room.mouseClicked(p5.mouseX, p5.mouseY);
  }

  function onClickCake() {
    popupImage = birthdayDrawing;

    room.addChildObject(invisibleLayer, 101);
    room.addChildObject(popupImage, 102);
  }

  function onClickInvisibleLayer() {
    room.removeChild(popupImage);
    room.removeChild(invisibleLayer);
  }
});
