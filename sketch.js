import SceneObject from "./SceneObject.js";

new p5((p5) => {
  const images = new Map();

  let canvas;
  let rootObject;

  let room;
  let portraitWall;

  let invisibleLayer; // Invisible image between the main scene and a pop up image
  let popupImage;
  
  let birthdayDrawing;

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
    const backgroundImg = images.get("assets/walls.png");
    
    let [canvasX, canvasY, backgroundScale] = calculateCanvasPositionAndBackgroundScale(backgroundImg);

    canvas = p5.createCanvas(backgroundScale*backgroundImg.width, backgroundScale*backgroundImg.height);
    canvas.position(canvasX, canvasY);

    // Create a root object (the background) and add other scene objects as its children.
    // The images that should be on top should have a higher layer number.
    room = new SceneObject(backgroundImg, 0, 0, backgroundScale, "DO_NOTHING");
    room.addChild(images.get("assets/cake.png"), 1500, 1100, 1, 0, "POPUP_BIRTHDAY");
    room.addChild(images.get("assets/rug.png"), 2900, 1000, 1, 0, "rug");
    room.addChild(images.get("assets/cigarettes.png"), 3200, 1400, 1, 1, "cigarettes");
    room.addChild(images.get("assets/r_u_ok.png"), 3380, 1600, 1, 1, "rUOk");

    const foodBowl = room.addChild(images.get("assets/dog_food.png"), 3200, 1600, 1, 2, "dogFood");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }

    room.addChild(images.get("assets/used_condom.png"), 3300, 2000, 1, 0, "condom");
    room.addChild(images.get("assets/mr.momo.png"), 1500, 1600, 1, 0, "mrMomo");
    room.addChild(images.get("assets/old_tv.png"), 900, 500, 1, 0, "oldTv");
    room.addChild(images.get("assets/orange.png"), 500, 1900, 1, 0, "orange");
    room.addChild(images.get("assets/pizza_box.png"), 3400, 700, 1, 1, "pizzaBox");
    room.addChild(images.get("assets/letter.png"), 2700, 1000, 1, 0, "letter");

    const table = room.addChild(images.get("assets/table.png"), 2200, 700, 1, 1, "table");
    table.isMouseOver = () => { return false };

    room.addChild(images.get("assets/cd_player.png"), 2300, 800, 1, 2, "cdPlayer");
    room.addChild(images.get("assets/tea_mug.png"), 1800, 1000, 1, 0, "teaMug");
    room.addChild(images.get("assets/portrait.png"), 2900, 130, 1, 0, "CLOSEUP_PORTRAIT");

    rootObject = room;

    const portraitWallImg = images.get("assets/zoomed_images/wall_background.png");
    portraitWall = new SceneObject(portraitWallImg, 0, 0, room.width / portraitWallImg.width, "DO_NOTHING");
    portraitWall.addChild(images.get("assets/zoomed_images/back_button.png"), 20, 20, 0.2, 0, "GO_BACK");
    portraitWall.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 860, 390, 0.08, 0, "DO_NOTHING");
    const leftEye = portraitWall.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 885, 405, 0.03, 1, "DO_NOTHING");
    leftEye.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(leftEye.img, leftEye.x + dx, leftEye.y + dy, leftEye.width, leftEye.height);
    }
    portraitWall.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), 860, 395, 0.07, 2, "DO_NOTHING");
    portraitWall.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 970, 390, 0.08, 0, "DO_NOTHING");
    const rightEye = portraitWall.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 995, 400, 0.03, 1, "DO_NOTHING");
    rightEye.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(rightEye.img, rightEye.x + dx, rightEye.y + dy, rightEye.width, rightEye.height);
    }
    portraitWall.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), 970, 390, 0.07, 2, "DO_NOTHING");
    portraitWall.addChild(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.png"), 600, 70, 0.5, 0, "DO_NOTHING");

    const invisibleLayerImg = p5.createImage(backgroundImg.width, backgroundImg.height);
    invisibleLayer = new SceneObject(invisibleLayerImg, 0, 0, room.scale, "POPUP_REMOVE");

    const birthdayImg = images.get("assets/zoomed_images/birthday.png")
    const birthdayImgScale = p5.height / birthdayImg.height;
    const birthdayImgX = (p5.width - birthdayImgScale*birthdayImg.width) / 2;
    const birthdayImgY = 0;
    birthdayDrawing = new SceneObject(birthdayImg, birthdayImgX, birthdayImgY, birthdayImgScale, "DO_NOTHING");
  }

  p5.draw = () => {
    rootObject.draw(p5);
  }

  p5.mouseClicked = () => {
    const message = rootObject.mouseClicked(p5.mouseX, p5.mouseY);
    
    switch (message) {
      case "POPUP_BIRTHDAY":
        invisibleLayer.windowResized(room.scale / invisibleLayer.scale);
        birthdayDrawing.windowResized(p5.height / birthdayDrawing.img.height / birthdayDrawing.scale);
        popupImage = birthdayDrawing;
        room.addChildObject(invisibleLayer, 101);
        room.addChildObject(popupImage, 102);
        break;
      case "POPUP_REMOVE":
        room.removeChild(popupImage);
        room.removeChild(invisibleLayer);
        break;
      case "CLOSEUP_PORTRAIT":
        portraitWall.windowResized(p5.width / portraitWall.width);
        rootObject = portraitWall;
        break;
      case "GO_BACK":
        room.windowResized(p5.width / room.width)
        rootObject = room;
        break;
      case "DO_NOTHING":
        break;
      default:
        console.log(message);
    }
  }

  p5.windowResized = () => {
    const backgroundImg = rootObject.img;
    
    let [canvasX, canvasY, backgroundScale] = calculateCanvasPositionAndBackgroundScale(backgroundImg);
    
    p5.resizeCanvas(backgroundScale*backgroundImg.width, backgroundScale*backgroundImg.height);
    canvas.position(canvasX, canvasY);

    rootObject.windowResized(backgroundScale / rootObject.scale);
  }

  // Calculate the canvas size and position based on dimensions of the background image.
  // The background image should fill the whole canvas.
  // The canvas should be centered and fill as much of the window as possible.
  function calculateCanvasPositionAndBackgroundScale(backgroundImg) {
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

    return [canvasX, canvasY, backgroundScale];
  }
});
