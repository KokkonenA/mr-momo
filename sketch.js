import Scene from "./Scene.js";
import SceneObject from "./SceneObject.js";

new p5((p5) => {
  const images = new Map();
  const sounds = new Map();

  let canvas;

  // Scenes
  let activeScene;

  let roomOverview;
  let orangeCloseup;
  let dogFoodCloseup;
  let portraitCloseup;

  // Pop-up images
  let invisibleLayer; // Invisible image between the main scene and a pop-up image that catches click events.
  let popupImage; // Active pop-up image

  let birthdayDrawing;
  let note;
  let noteTranslated;

  // Pop-up videos
  let blurLayer; // Image between the main scene and a pop-up video that blurs the background and catches click events.
  let popupVideo; // Active pop-up video

  let teaTime;
  let balloonBlowing;
  let piano;

  // Sounds
  let eating;
  let larva;

  // Load images and sounds. By doing this in the preload we can be sure that everything is loaded when the setup starts.
  p5.preload = () => {
    p5.loadJSON("imageList.json", (imagePaths) => {
      for (let path of imagePaths) {
        images.set(path, p5.loadImage(path));
      }
    });
    p5.loadJSON("soundList.json", (soundPaths) => {
      for (let path of soundPaths) {
        sounds.set(path, p5.loadSound(path));
      }
    })
  }

  p5.setup = () => {
    // ROOM OVERVIEW
    const backgroundImg = images.get("assets/walls.png");

    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();

    canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);

    const backgroundScale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);

    const room = new SceneObject(backgroundImg, 0, 0, backgroundScale, "DO_NOTHING");
    room.addChild(images.get("assets/cake.png"), 0.33, 0.5, 0.9, 0, "IMAGE_BIRTHDAY");
    room.addChild(images.get("assets/rug.png"), 0.72, 0.47, 1, 0, "rug");
    room.addChild(images.get("assets/cigarettes.png"), 0.8, 0.65, 1, 1, "cigarettes");
    room.addChild(images.get("assets/r_u_ok.png"), 0.83, 0.71, 1, 1, "rUOk");

    const foodBowl = room.addChild(images.get("assets/dog_food.png"), 0.79, 0.73, 1.1, 2, "CLOSEUP_DOG_FOOD");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }

    room.addChild(images.get("assets/used_condom.png"), 0.9, 0.87, 1, 0, "VIDEO_CONDOM");
    room.addChild(images.get("assets/mr.momo.png"), 0.35, 0.7, 1, 0, "mrMomo");
    room.addChild(images.get("assets/old_tv.png"), 0.24, 0.25, 1, 0, "oldTv");
    room.addChild(images.get("assets/orange.png"), 0.12, 0.85, 1, 0, "CLOSEUP_ORANGE");
    room.addChild(images.get("assets/pizza_box.png"), 0.83, 0.35, 1, 1, "pizzaBox");
    room.addChild(images.get("assets/letter.png"), 0.68, 0.45, 1, 0, "IMAGE_NOTE");

    const table = room.addChild(images.get("assets/table.png"), 0.56, 0.31, 1, 1, "table");
    table.isMouseOver = () => { return false };

    room.addChild(images.get("assets/cd_player.png"), 0.63, 0.34, 1, 2, "VIDEO_PIANO");
    room.addChild(images.get("assets/tea_mug.png"), 0.47, 0.44, 1, 0, "VIDEO_TEATIME");
    room.addChild(images.get("assets/portrait.png"), 0.74, 0.05, 1, 0, "CLOSEUP_PORTRAIT");

    roomOverview = new Scene(room);
    activeScene = roomOverview;

    // INVISIBLE LAYER
    const invisibleImg = p5.createImage(backgroundImg.width, backgroundImg.height);
    invisibleLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "IMAGE_REMOVE");
    invisibleLayer.draw = () => { return };

    // POPUP IMAGES
    birthdayDrawing = createPopupImageObject("assets/zoomed_images/birthday.png", 0.9, "DO_NOTHING");
    note = createPopupImageObject("assets/zoomed_images/note.png", 0.6, "IMAGE_NOTE_TRANSLATED");
    noteTranslated = createPopupImageObject("assets/zoomed_images/note_translated.png", 0.6, "IMAGE_NOTE_ORIGINAL");

    // BLUR LAYER
    blurLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "VIDEO_REMOVE");
    blurLayer.draw = (p5) => { p5.filter(p5.BLUR, 3); }

    // POPUP VIDEOS
    balloonBlowing = createPopupVideoObject("assets/videos/condom.mp4");
    piano = createPopupVideoObject("assets/videos/olenyksin.mp4");
    teaTime = createPopupVideoObject("assets/videos/tea_time.mp4");

    // GO BACK BUTTON PROPERTIES
    const returnImg = images.get("assets/zoomed_images/back_button.png");
    const returnMargin = backgroundScale * 100;
    const returnScale = backgroundScale * 0.5;

    // ORANGE CLOSEUP
    const orangeWithLarvaImg = images.get("assets/zoomed_images/orange_with_larva.png");
    const orangeScale = calculateBackgroundScale(orangeWithLarvaImg.width, orangeWithLarvaImg.height);
    const orangeWithLarva = new SceneObject(orangeWithLarvaImg, 0, 0, orangeScale, "DO_NOTHING");
    const orangeReturn = new SceneObject(returnImg, returnMargin, returnMargin, returnScale, "RETURN_ORANGE");
    orangeWithLarva.addChildObject(orangeReturn, 0);
    orangeCloseup = new Scene(orangeWithLarva);

    // DOG FOOD CLOSEUP
    const dogFoodImg = images.get("assets/zoomed_images/dog_food.png");
    const dogFoodScale = calculateBackgroundScale(dogFoodImg.width, dogFoodImg.height);
    const dogFood = new SceneObject(dogFoodImg, 0, 0, dogFoodScale, "DO_NOTHING");
    const dogFoodReturn = new SceneObject(returnImg, returnMargin, returnMargin, returnScale, "RETURN_DOG_FOOD");
    dogFood.addChildObject(dogFoodReturn, 0);
    dogFoodCloseup = new Scene(dogFood);

    // PORTRAIT CLOSEUP
    const portraitWallImg = images.get("assets/zoomed_images/wall_background.png");
    const portraitWallScale = calculateBackgroundScale(portraitWallImg.width, portraitWallImg.height);
    const portraitWall = new SceneObject(portraitWallImg, 0, 0, portraitWallScale, "DO_NOTHING");
    const portraitReturn = new SceneObject(returnImg, returnMargin, returnMargin, returnScale, "RETURN_PORTRAIT");
    portraitWall.addChildObject(portraitReturn, 0);
    const portrait = portraitWall.addChild(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.png"), 0.32, 0.05, 0.5, 0, "DO_NOTHING");

    const leftEye = portrait.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 0.365, 0.335, 0.155, 0, "DO_NOTHING");
    const leftIris = leftEye.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 0.24, 0.16, 0.4, 0, "DO_NOTHING");
    leftIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(leftIris.img, leftIris.x + dx, leftIris.y + dy, leftIris.width, leftIris.height);
    }
    leftEye.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), -0.12, -0.07, 1, 1, "DO_NOTHING");

    const rightEye = portrait.addChild(images.get("assets/zoomed_images/eye_white_part.png"), 0.51, 0.331, 0.155, 0, "DO_NOTHING");
    const rightIris = rightEye.addChild(images.get("assets/zoomed_images/eye_brown_circle.png"), 0.24, 0.16, 0.4, 0, "DO_NOTHING");
    rightIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(rightIris.img, rightIris.x + dx, rightIris.y + dy, rightIris.width, rightIris.height);
    }
    rightEye.addChild(images.get("assets/zoomed_images/eye_skin_outline.png"), -0.12, -0.07, 1, 1, "DO_NOTHING");

    portraitCloseup = new Scene(portraitWall);
    [leftEye, rightEye].forEach(object => portraitCloseup.addObjectToBeRedrawn(object));

    // SOUNDS
    eating = sounds.get("assets/sounds/eating.wav");
    larva = sounds.get("assets/sounds/slimy.wav");
  }

  p5.draw = () => {
    activeScene.draw(p5);
  }

  p5.mouseClicked = () => {
    const message = activeScene.mouseClicked(p5.mouseX, p5.mouseY);

    switch (message) {
      case "IMAGE_BIRTHDAY":
        insertInvisibleLayer();
        showPopupImage(birthdayDrawing, 0.9);
        break;
      case "IMAGE_NOTE":
        insertInvisibleLayer();
        showPopupImage(note, 0.6);
        break;
      case "IMAGE_NOTE_TRANSLATED":
        roomOverview.removeObject(popupImage);
        showPopupImage(noteTranslated, 0.6);
        break;
      case "IMAGE_NOTE_ORIGINAL":
        roomOverview.removeObject(popupImage);
        showPopupImage(note, 0.6);
        break;
      case "IMAGE_REMOVE":
        roomOverview.removeObject(popupImage);
        roomOverview.removeObject(invisibleLayer);
        break;
      case "VIDEO_CONDOM":
        startPopupVideo(balloonBlowing);
        break;
      case "VIDEO_PIANO":
        startPopupVideo(piano);
        break;
      case "VIDEO_TEATIME":
        startPopupVideo(teaTime);
        break;
      case "VIDEO_REMOVE":
        popupVideo.img.stop();
        roomOverview.removeObject(popupVideo);
        roomOverview.removeObject(blurLayer);
        break;
      case "CLOSEUP_DOG_FOOD":
        eating.loop();
        startScene(dogFoodCloseup);
        break;
      case "CLOSEUP_ORANGE":
        larva.loop();
        startScene(orangeCloseup);
        break;
      case "CLOSEUP_PORTRAIT":
        startScene(portraitCloseup);
        break;
      case "RETURN_DOG_FOOD":
        eating.stop();
        startScene(roomOverview);
        break;
      case "RETURN_ORANGE":
        larva.stop();
        startScene(roomOverview);
        break;
      case "RETURN_PORTRAIT":
        startScene(roomOverview);
        break;
      case "DO_NOTHING":
        break;
      default:
        console.log(message);
    }
  }

  p5.windowResized = () => {
    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();

    p5.resizeCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);

    const backgroundScale = calculateBackgroundScale(activeScene.width, activeScene.height);

    activeScene.windowResized(backgroundScale);
  }

  // Calculate the canvas size and position.
  // The canvas should be centered and fill as much of the window as possible
  // while maintaing the aspect ratio.
  function calculateCanvasPositionAndSize() {
    const aspectRatioWidth = 16;
    const aspectRatioHeight = 9;

    const widthScalar = p5.windowWidth / aspectRatioWidth;
    const heightScalar = p5.windowHeight / aspectRatioHeight;

    if (widthScalar < heightScalar) {
      var sizeScalar = widthScalar;
      var x = 0;
      var y = (p5.windowHeight - sizeScalar * aspectRatioHeight) / 2;
    } else {
      var sizeScalar = heightScalar;
      var x = (p5.windowWidth - sizeScalar * aspectRatioWidth) / 2;
      var y = 0;
    }
    const width = sizeScalar * aspectRatioWidth;
    const height = sizeScalar * aspectRatioHeight;

    return [x, y, width, height];
  }

  // Calculate and return background scale so it fills the canvas.
  function calculateBackgroundScale(currentWidth, currentHeight) {
    const windowToImageWidthRatio = p5.width / currentWidth;
    const windowToImageHeightRatio = p5.height / currentHeight;

    if (windowToImageWidthRatio > windowToImageHeightRatio) {
      return windowToImageWidthRatio;
    }
    return windowToImageHeightRatio;
  } 

  // Creates and returns a popup image object.
  function createPopupImageObject(path, toScreenRatio, message) {
    const img = images.get(path);
    const scale = toScreenRatio * p5.height / img.height;
    const x = (p5.width - scale * img.width) / 2;
    const y = (p5.height - scale * img.height) / 2;
    return new SceneObject(img, x, y, scale, message);
  }

  // Creates and returns a popup video object.
  function createPopupVideoObject(path) {
    const video = p5.createVideo(path);
    video.hide();
    const scale = 0.8 * p5.width / video.width;
    const x = (p5.width - scale * video.width) / 2;
    const y = (p5.height - scale * video.height) / 2;
    return new SceneObject(video, x, y, scale, "DO_NOTHING");
  }

  // Inserts the inivisible layer to the main scene.
  function insertInvisibleLayer()
  {
    invisibleLayer.windowResized(p5.width / invisibleLayer.width);
    roomOverview.addObject(invisibleLayer, 101, false);
  }

  // Shows a pop-up image.
  function showPopupImage(img, toScreenRatio)
  {
    img.windowResized(toScreenRatio * p5.height / img.height);
    popupImage = img;
    roomOverview.addObject(popupImage, 102, false);
  }

  // Starts a pop-up video.
  function startPopupVideo(video) {
    blurLayer.windowResized(p5.width / blurLayer.width);
    video.windowResized(0.8 * p5.width / video.width);
    popupVideo = video;
    roomOverview.addObject(blurLayer, 101, false);
    roomOverview.addObject(popupVideo, 102, true);
    popupVideo.img.loop();
  }

  // Starts a scene.
  function startScene(scene) {
    scene.windowResized(p5.width / scene.width);
    activeScene = scene;
  }
});
