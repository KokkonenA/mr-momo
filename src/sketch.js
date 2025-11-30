import Scene from "./Scene.js";
import SceneObject from "./SceneObject.js";

new p5((p5) => {
  const images = new Map();
  const sounds = new Map();

  const sceneWidth = 1600;
  const sceneHeight = 900;

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
    roomOverview = new Scene();

    const backgroundImg = images.get("assets/walls.png");
    const backgroundScale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    roomOverview.addObject(new SceneObject(backgroundImg, 0, 0, backgroundScale, "DO_NOTHING"));

    roomOverview.addObject(new SceneObject(images.get("assets/old_tv.png"), 350, 250, 0.4, "oldTv"));
    roomOverview.addObject(new SceneObject(images.get("assets/cake.png"), 550, 500, 0.3, "IMAGE_BIRTHDAY"));
    roomOverview.addObject(new SceneObject(images.get("assets/tea_mug.png"), 700, 400, 0.4, "VIDEO_TEATIME"));
    roomOverview.addObject(new SceneObject(images.get("assets/letter.png"), 1008, 400, 0.4, "IMAGE_NOTE"));

    const table = new SceneObject(images.get("assets/table.png"), 800, 300, 0.4, "table");
    table.isMouseOver = () => { return false };
    roomOverview.addObject(table);

    roomOverview.addObject(new SceneObject(images.get("assets/cd_player.png"), 950, 330, 0.4, "VIDEO_PIANO"));
    roomOverview.addObject(new SceneObject(images.get("assets/portrait.png"), 1100, 50, 0.4, "CLOSEUP_PORTRAIT"));
    roomOverview.addObject(new SceneObject(images.get("assets/orange.png"), 200, 750, 0.4, "CLOSEUP_ORANGE"));
    roomOverview.addObject(new SceneObject(images.get("assets/mr.momo.png"), 600, 650, 0.4, "mrMomo"));
    roomOverview.addObject(new SceneObject(images.get("assets/rug.png"), 1150, 430, 0.4, "rug"));
    roomOverview.addObject(new SceneObject(images.get("assets/pizza_box.png"), 1350, 330, 0.4, "pizzaBox"));
    roomOverview.addObject(new SceneObject(images.get("assets/cigarettes.png"), 1250, 600, 0.4, "cigarettes"));
    roomOverview.addObject(new SceneObject(images.get("assets/r_u_ok.png"), 1370, 680, 0.4, "rUOk"));

    const foodBowl = new SceneObject(images.get("assets/dog_food.png"), 1300, 680, 0.4, "CLOSEUP_DOG_FOOD");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }
    roomOverview.addObject(foodBowl);

    roomOverview.addObject(new SceneObject(images.get("assets/used_condom.png"), 1400, 800, 0.4, "VIDEO_CONDOM"));

    // POPUP IMAGES
    const invisibleImg = p5.createImage(backgroundImg.width, backgroundImg.height);
    invisibleLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "IMAGE_REMOVE");
    invisibleLayer.draw = () => { return };

    birthdayDrawing = createPopupImageObject("assets/zoomed_images/birthday.png", 0.9, "DO_NOTHING");
    note = createPopupImageObject("assets/zoomed_images/note.png", 0.6, "IMAGE_NOTE_TRANSLATED");
    noteTranslated = createPopupImageObject("assets/zoomed_images/note_translated.png", 0.6, "IMAGE_NOTE_ORIGINAL");

    // POPUP VIDEOS
    blurLayer = new SceneObject(invisibleImg, 0, 0, backgroundScale, "VIDEO_REMOVE");
    blurLayer.draw = (p5) => { p5.filter(p5.BLUR, 3); }

    balloonBlowing = createPopupVideoObject("assets/videos/condom.mp4");
    piano = createPopupVideoObject("assets/videos/olenyksin.mp4");
    teaTime = createPopupVideoObject("assets/videos/tea_time.mp4");

    // CLOSEUP SCENES
    orangeCloseup = createCloseupScene("assets/zoomed_images/orange_with_larva.png", "RETURN_ORANGE");
    dogFoodCloseup = createCloseupScene("assets/zoomed_images/dog_food.png", "RETURN_DOG_FOOD");

    portraitCloseup = createCloseupScene("assets/zoomed_images/wall_background.png", "RETURN_PORTRAIT");
    portraitCloseup.addObject(new SceneObject(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.png"), 500, 70, 0.4, "DO_NOTHING"));

    portraitCloseup.addObject(new SceneObject(images.get("assets/zoomed_images/eye_white_part.png"), 713, 331, 0.06, "DO_NOTHING"), true);
    portraitCloseup.addObject(new SceneObject(images.get("assets/zoomed_images/eye_skin_outline.png"), 708, 328, 0.06, "DO_NOTHING"), true);
    const leftIris = new SceneObject(images.get("assets/zoomed_images/eye_brown_circle.png"), 730, 336, 0.025, "DO_NOTHING");
    leftIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(leftIris.img, leftIris.x + dx, leftIris.y + dy, leftIris.width, leftIris.height);
    }
    portraitCloseup.addObject(leftIris, true);

    portraitCloseup.addObject(new SceneObject(images.get("assets/zoomed_images/eye_white_part.png"), 798, 327, 0.06, "DO_NOTHING"), true);
    portraitCloseup.addObject(new SceneObject(images.get("assets/zoomed_images/eye_skin_outline.png"), 793, 324, 0.06, "DO_NOTHING"), true);
    const rightIris = new SceneObject(images.get("assets/zoomed_images/eye_brown_circle.png"), 814, 333, 0.025, "DO_NOTHING");
    rightIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(rightIris.img, rightIris.x + dx, rightIris.y + dy, rightIris.width, rightIris.height);
    }
    portraitCloseup.addObject(rightIris, true);

    // SOUNDS
    eating = sounds.get("assets/sounds/eating.wav");
    larva = sounds.get("assets/sounds/slimy.wav");

    // Create canvas and start the main scene.
    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();
    canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);
    startScene(roomOverview);
  }

  p5.draw = () => {
    activeScene.draw(p5);
  }

  p5.mouseClicked = () => {
    const message = activeScene.mouseClicked(p5.mouseX, p5.mouseY);

    switch (message) {
      case "IMAGE_BIRTHDAY":
        insertInvisibleLayer();
        showPopupImage(birthdayDrawing);
        break;
      case "IMAGE_NOTE":
        insertInvisibleLayer();
        showPopupImage(note);
        break;
      case "IMAGE_NOTE_TRANSLATED":
        roomOverview.removeObject(popupImage);
        showPopupImage(noteTranslated);
        break;
      case "IMAGE_NOTE_ORIGINAL":
        roomOverview.removeObject(popupImage);
        showPopupImage(note);
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
    canvas.position(canvasX, canvasY);
    p5.resizeCanvas(canvasWidth, canvasHeight);

    activeScene.update(canvasWidth / sceneWidth);
  }

  // Calculate and return the canvas size and position.
  // The canvas should be centered and fill as much of the window as possible
  // while maintaing the aspect ratio.
  function calculateCanvasPositionAndSize() {
    const windowToSceneWidthRatio = p5.windowWidth / sceneWidth;
    const windowToSceneHeightRatio = p5.windowHeight / sceneHeight;

    if (windowToSceneWidthRatio > windowToSceneHeightRatio) {
      var scale = windowToSceneHeightRatio;
      var x = (p5.windowWidth - scale * sceneWidth) / 2;
      var y = 0;
    } else {
      var scale = windowToSceneWidthRatio;
      var x = 0;
      var y = (p5.windowHeight - scale * sceneHeight) / 2;
    }
    const width = scale * sceneWidth;
    const height = scale * sceneHeight;

    return [x, y, width, height];
  }

  // Calculate and return scale for background so it fills the scene.
  function calculateBackgroundScale(currentWidth, currentHeight) {
    const sceneToImageWidthRatio = sceneWidth / currentWidth;
    const sceneToImageHeightRatio = sceneHeight / currentHeight;

    if (sceneToImageWidthRatio > sceneToImageHeightRatio) {
      return sceneToImageWidthRatio;
    }
    return sceneToImageHeightRatio;
  }

  // Create and return a popup image object.
  function createPopupImageObject(path, imageToSceneHeightRatio, message) {
    const img = images.get(path);
    const scale = imageToSceneHeightRatio * sceneHeight / img.height;
    const x = (sceneWidth - scale * img.width) / 2;
    const y = (sceneHeight - scale * img.height) / 2;
    return new SceneObject(img, x, y, scale, message);
  }

  // Create and return a popup video object.
  function createPopupVideoObject(path) {
    const video = p5.createVideo(path);
    video.hide();
    const scale = 0.8 * sceneWidth / video.width;
    const x = (sceneWidth - scale * video.width) / 2;
    const y = (sceneHeight - scale * video.height) / 2;
    return new SceneObject(video, x, y, scale, "DO_NOTHING");
  }

  // Create and return a closeup scene with a background and return button.
  function createCloseupScene(path, message) {
    const scene = new Scene();
    const img = images.get(path);
    const scale = calculateBackgroundScale(img.width, img.height);
    scene.addObject(new SceneObject(img, 0, 0, scale, "DO_NOTHING"));
    scene.addObject(new SceneObject(images.get("assets/zoomed_images/back_button.png"), 50, 50, 0.22, message));
    return scene;
  }

  // Start a scene.
  function startScene(scene) {
    scene.update(p5.width / sceneWidth);
    activeScene = scene;
  }

  // Insert the inivisible layer to the main scene.
  function insertInvisibleLayer() {
    invisibleLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(invisibleLayer);
  }

  // Show a pop-up image.
  function showPopupImage(img) {
    img.update(p5.width / sceneWidth);
    popupImage = img;
    roomOverview.addObject(popupImage);
  }

  // Start a pop-up video.
  function startPopupVideo(video) {
    blurLayer.update(p5.width / sceneWidth);
    video.update(p5.width / sceneWidth);
    popupVideo = video;
    roomOverview.addObject(blurLayer);
    roomOverview.addObject(popupVideo, true);
    popupVideo.img.loop();
  }
});
