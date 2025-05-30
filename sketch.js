import Scene from "./Scene.js";
import SceneObject from "./SceneObject.js";

new p5((p5) => {
  const images = new Map();

  let canvas;
  let activeScene;

  let roomOverview;
  let portraitCloseup;

  let invisibleLayer; // Invisible image between the main scene and a pop-up image that catches click events.
  let popupImage;
  
  let birthdayDrawing;

  let blurLayer; // Image between the main scene and a pop-up video that blurs the background and catches click events.
  let popupVideo;

  let teaTime;

  // Load images. By doing this in the preload we can be sure that everything is loaded when the setup starts.
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

    const [canvasX, canvasY, backgroundScale] = calculateCanvasPositionAndBackgroundScale(backgroundImg.width, backgroundImg.height);

    canvas = p5.createCanvas(backgroundScale * backgroundImg.width, backgroundScale * backgroundImg.height);
    canvas.position(canvasX, canvasY);

    const room = new SceneObject(backgroundImg, 0, 0, backgroundScale, "DO_NOTHING");
    room.addChild(images.get("assets/cake.png"), 0.35, 0.5, 1, 0, "IMAGE_BIRTHDAY");
    room.addChild(images.get("assets/rug.png"), 0.72, 0.47, 1, 0, "rug");
    room.addChild(images.get("assets/cigarettes.png"), 0.8, 0.65, 1, 1, "cigarettes");
    room.addChild(images.get("assets/r_u_ok.png"), 0.85, 0.75, 1, 1, "rUOk");

    const foodBowl = room.addChild(images.get("assets/dog_food.png"), 0.8, 0.75, 1, 2, "dogFood");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }

    room.addChild(images.get("assets/used_condom.png"), 0.9, 0.87, 1, 0, "condom");
    room.addChild(images.get("assets/mr.momo.png"), 0.35, 0.7, 1, 0, "mrMomo");
    room.addChild(images.get("assets/old_tv.png"), 0.18, 0.25, 1, 0, "oldTv");
    room.addChild(images.get("assets/orange.png"), 0.12, 0.85, 1, 0, "orange");
    room.addChild(images.get("assets/pizza_box.png"), 0.83, 0.35, 1, 1, "pizzaBox");
    room.addChild(images.get("assets/letter.png"), 0.68, 0.45, 1, 0, "letter");

    const table = room.addChild(images.get("assets/table.png"), 0.56, 0.3, 1, 1, "table");
    table.isMouseOver = () => { return false };

    room.addChild(images.get("assets/cd_player.png"), 0.6, 0.34, 1, 2, "cdPlayer");
    room.addChild(images.get("assets/tea_mug.png"), 0.47, 0.44, 1, 0, "VIDEO_TEATIME");
    room.addChild(images.get("assets/portrait.png"), 0.74, 0.05, 1, 0, "CLOSEUP_PORTRAIT");

    roomOverview = new Scene(room);
    activeScene = roomOverview;

    const invisibleImg = p5.createImage(backgroundImg.width, backgroundImg.height);
    invisibleLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "IMAGE_REMOVE");

    const birthdayImg = images.get("assets/zoomed_images/birthday.png")
    const birthdayImgScale = 0.9 * p5.height / birthdayImg.height;
    const birthdayImgX = (p5.width - birthdayImgScale * birthdayImg.width) / 2;
    const birthdayImgY = (p5.height - birthdayImgScale * birthdayImg.height) / 2;
    birthdayDrawing = new SceneObject(birthdayImg, birthdayImgX, birthdayImgY, birthdayImgScale, "DO_NOTHING");

    blurLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "VIDEO_REMOVE");
    blurLayer.draw = (graphicsObject) => {
      graphicsObject.filter(graphicsObject.BLUR, 3);
    }

    const teaTimeVideo = p5.createVideo("assets/videos/tea_time.mp4");
    teaTimeVideo.hide();
    const teaTimeScale = 0.8 * p5.width / teaTimeVideo.width;
    const teaTimeX = (p5.width - teaTimeScale * teaTimeVideo.width) / 2;
    const teaTimeY = (p5.height - teaTimeScale * teaTimeVideo.height) / 2;
    teaTime = new SceneObject(teaTimeVideo, teaTimeX, teaTimeY, teaTimeScale, "DO_NOTHING");

    const portraitWallImg = images.get("assets/zoomed_images/wall_background.png");
    const portraitWall = new SceneObject(portraitWallImg, 0, 0, room.width / portraitWallImg.width, "DO_NOTHING");
    portraitWall.addChild(images.get("assets/zoomed_images/back_button.png"), 0.02, 0.04, 0.2, 0, "GO_BACK");
    const portrait = portraitWall.addChild(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.png"), 0.32, 0.05, 0.5, 0, "DO_NOTHING");

    const leftEye = portrait.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 0.365, 0.335, 0.155, 0, "DO_NOTHING");
    const leftIris = leftEye.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 0.25, 0.16, 0.4, 0, "DO_NOTHING");
    leftIris.draw = (graphicsObject) => {
      const factor = 1000;
      const dx = (graphicsObject.mouseX - graphicsObject.width / 2) / factor;
      const dy = (graphicsObject.mouseY - graphicsObject.height / 2) / factor;
      graphicsObject.image(leftIris.img, leftIris.x + dx, leftIris.y + dy, leftIris.width, leftIris.height);
    }
    leftEye.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), -0.12, -0.07, 1, 1, "DO_NOTHING");

    const rightEye = portrait.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 0.51, 0.331, 0.155, 0, "DO_NOTHING");
    const rightIris = rightEye.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 0.25, 0.16, 0.4, 0, "DO_NOTHING");
    rightIris.draw = (graphicsObject) => {
      const factor = 1000;
      const dx = (graphicsObject.mouseX - graphicsObject.width / 2) / factor;
      const dy = (graphicsObject.mouseY - graphicsObject.height / 2) / factor;
      graphicsObject.image(rightIris.img, rightIris.x + dx, rightIris.y + dy, rightIris.width, rightIris.height);
    }
    rightEye.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), -0.12, -0.07, 1, 1, "DO_NOTHING");

    portraitCloseup = new Scene(portraitWall);
    [leftEye, rightEye].forEach(object => portraitCloseup.addObjectToBeRedrawn(object));
  }

  p5.draw = () => {
    activeScene.draw(p5);
  }

  p5.mouseClicked = () => {
    const message = activeScene.mouseClicked(p5.mouseX, p5.mouseY);
    
    switch (message) {
      case "IMAGE_BIRTHDAY":
        invisibleLayer.windowResized(p5.width / invisibleLayer.width);
        birthdayDrawing.windowResized(0.9 * p5.height / birthdayDrawing.height);
        popupImage = birthdayDrawing;
        roomOverview.addObject(invisibleLayer, 101, false);
        roomOverview.addObject(popupImage, 102, false);
        break;
      case "IMAGE_REMOVE":
        roomOverview.removeObject(popupImage);
        roomOverview.removeObject(invisibleLayer);
        break;
      case "VIDEO_TEATIME":
        blurLayer.windowResized(p5.width / blurLayer.width);
        teaTime.windowResized(0.8 * p5.width / teaTime.width);
        popupVideo = teaTime;
        roomOverview.addObject(blurLayer, 101, false);
        roomOverview.addObject(popupVideo, 102, true);
        popupVideo.img.loop();
        break;
      case "VIDEO_REMOVE":
        popupVideo.img.stop();
        roomOverview.removeObject(popupVideo);
        roomOverview.removeObject(blurLayer);
        break;
      case "CLOSEUP_PORTRAIT":
        portraitCloseup.windowResized(p5.width / portraitCloseup.width);
        activeScene = portraitCloseup;
        break;
      case "GO_BACK":
        ReturnToMainScene();
        break;
      case "DO_NOTHING":
        break;
      default:
        console.log(message);
    }
  }

  p5.windowResized = () => {
    const [canvasX, canvasY, backgroundScale] = calculateCanvasPositionAndBackgroundScale(p5.width, p5.height);

    p5.resizeCanvas(backgroundScale * p5.width, backgroundScale * p5.height);
    canvas.position(canvasX, canvasY);

    activeScene.windowResized(backgroundScale);
  }

  // Calculate the canvas size and position based on dimensions of the background image.
  // The root object image and canvas should have the same size
  // The canvas should be centered and fill as much of the window as possible.
  function calculateCanvasPositionAndBackgroundScale(currentWidth, currentHeight) {
    const windowImageWidthRelation = p5.windowWidth / currentWidth;
    const windowImageHeightRelation = p5.windowHeight / currentHeight;

    if (windowImageWidthRelation < windowImageHeightRelation) {
      var backgroundScale = windowImageWidthRelation;
      var canvasX = 0;
      var canvasY = (p5.windowHeight - backgroundScale * currentHeight) / 2;
    }
    else {
      var backgroundScale = windowImageHeightRelation;
      var canvasX = (p5.windowWidth - backgroundScale * currentWidth) / 2;
      var canvasY = 0;
    }

    return [canvasX, canvasY, backgroundScale];
  }

  // Return to the room overview
  function ReturnToMainScene()
  {
    roomOverview.windowResized(p5.width / roomOverview.width)
    activeScene = roomOverview;
  }
});
