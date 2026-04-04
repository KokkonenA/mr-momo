import HImage from "./classes/HImage.js"
import Image from "./classes/Image.js";
import Scene from "./classes/Scene.js";
import SceneObject from "./classes/SceneObject.js";
import { videoWidth, videoHeight, Video } from "./classes/Video.js";

new p5((p5) => {
  const images = new Map();
  const sounds = new Map();
  const videos = new Map();

  const sceneWidth = 1600;
  const sceneHeight = 900;

  const audioFadeDuration = 3;

  let canvas;

  // Scenes
  let activeScene;

  let roomOverview;
  let orangeCloseup;
  let dogFoodCloseup;
  let portraitCloseup;

  let invisibleLayer; // Invisible image between the main scene and a pop-up image that catches click events.
  let blurLayer; // Image between the main scene and a pop-up that blurs the background and catches click events.

  // Pop-up images
  let popupImage; // Active pop-up image

  let birthdayDrawing;
  let note;
  let noteTranslated;
  let intro;
  let start;

  // Pop-up videos
  let popupVideo; // Active pop-up video

  let teaTime;
  let balloonBlowing;
  let piano;

  // Pop-up player
  let frame;
  let rewind;
  let play;
  let pause;
  let stop;
  let fastForward;
  let blueHands;
  let playbackSpeed;
  let playbackIndicator;
  let blackBackground; // Sometimes at least on Firefox the video frame is not drawn showing the room overview below.
  let timeSinceLastUpdate;

  // Sounds
  let fridge;
  let eating;
  let larva;
  let blow;
  let paper;

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
    p5.loadJSON("videoList.json", (videoPaths) => {
      for (let path of videoPaths) {
        const video = p5.createVideo(path);
        video.hide();
        videos.set(path, video);
      }
    })
  }

  p5.setup = () => {
    // ROOM OVERVIEW
    roomOverview = new Scene();

    const backgroundImg = images.get("assets/walls.png");
    const backgroundScale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    roomOverview.addObject(new Image(backgroundImg, 0, 0, backgroundScale, "DO_NOTHING"));

    roomOverview.addObject(new HImage(images.get("assets/old_tv.png"), images.get("assets/old_tv__outlined.png"), 350, 250, 0.4, "PLAYER_RUN"));
    roomOverview.addObject(new HImage(images.get("assets/cake.png"), images.get("assets/cake__outlined.png"), 530, 500, 0.25, "IMAGE_BIRTHDAY"));
    roomOverview.addObject(new HImage(images.get("assets/tea_mug.png"), images.get("assets/tea_mug__outlined.png"), 700, 400, 0.4, "VIDEO_TEATIME"));
    roomOverview.addObject(new HImage(images.get("assets/letter.png"), images.get("assets/letter__outlined.png"), 1050, 400, 0.4, "IMAGE_NOTE"));

    const table = new Image(images.get("assets/table.png"), 800, 300, 0.4, "DO_NOTHING");
    table.isMouseOver = () => { return false };
    roomOverview.addObject(table);

    roomOverview.addObject(new HImage(images.get("assets/cd_player.png"), images.get("assets/cd_player__outlined.png"), 950, 320, 0.4, "VIDEO_PIANO"));
    roomOverview.addObject(new HImage(images.get("assets/portrait.png"), images.get("assets/portrait__outlined.png"), 1100, 50, 0.4, "CLOSEUP_PORTRAIT"));
    roomOverview.addObject(new HImage(images.get("assets/orange.png"), images.get("assets/orange__outlined.png"), 200, 750, 0.4, "CLOSEUP_ORANGE"));
    roomOverview.addObject(new Image(images.get("assets/mr.momo.png"), 600, 650, 0.4, "Momo: ..."));
    roomOverview.addObject(new Image(images.get("assets/rug.png"), 1150, 430, 0.4, "DO_NOTHING"));
    roomOverview.addObject(new Image(images.get("assets/r_u_ok.png"), 1400, 550, 0.4, "DO_NOTHING"));

    const foodBowl = new HImage(images.get("assets/dog_food.png"), images.get("assets/dog_food__outlined.png"), 1320, 550, 0.4, "CLOSEUP_DOG_FOOD");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }
    roomOverview.addObject(foodBowl);

    roomOverview.addObject(new HImage(images.get("assets/used_condom.png"), images.get("assets/used_condom__outlined.png"), 1400, 770, 0.4, "VIDEO_CONDOM"));

    invisibleLayer = new SceneObject(0, 0, sceneWidth, sceneHeight, "IMAGE_REMOVE");
    invisibleLayer.draw = () => { return };
    blurLayer = new SceneObject(0, 0, sceneWidth, sceneHeight, "VIDEO_REMOVE");
    blurLayer.draw = (p5) => { p5.filter(p5.BLUR, 3); }

    // POPUP IMAGES
    birthdayDrawing = createPopupImageObject("assets/zoomed_images/birthday.png", 0.9, "DO_NOTHING");
    note = createPopupImageObject("assets/zoomed_images/note.png", 0.6, "IMAGE_NOTE_TRANSLATED");
    noteTranslated = createPopupImageObject("assets/zoomed_images/note_translated.png", 0.6, "IMAGE_NOTE_ORIGINAL");
    intro = createPopupImageObject("assets/startscreen.png", 1, "DO_NOTHING");
    start = new Image(images.get("assets/player/play_button.png"), 750, 600, 0.25, "START");

    // POPUP VIDEOS
    balloonBlowing = createPopupVideoObject("assets/videos/condom.mp4");
    piano = createPopupVideoObject("assets/videos/olenyksin.mp4");
    teaTime = createPopupVideoObject("assets/videos/tea_time.mp4");

    // POPUP PLAYER
    frame = createPopupImageObject("assets/player/frame.png", 0.9, "DO_NOTHING");
    playbackIndicator = new SceneObject(frame.x + 80, frame.y + 80, 30, 30, "DO_NOTHING");
    playbackIndicator.draw = drawPlayBackIndicator;

    rewind = new Image(images.get("assets/player/rewind_button.png"), 580, 750, 0.2, "PLAYER_REWIND");
    play = new Image(images.get("assets/player/play_button.png"), 680, 750, 0.2, "PLAYER_PLAY");
    pause = new Image(images.get("assets/player/pause_button.png"), 780, 750, 0.2, "PLAYER_PAUSE");
    stop = new Image(images.get("assets/player/stop_button.png"), 880, 750, 0.2, "PLAYER_STOP");
    fastForward = new Image(images.get("assets/player/fast_forward_button.png"), 980, 750, 0.2, "PLAYER_FASTFORWARD");
    playbackSpeed = 0;
    timeSinceLastUpdate = 0;

    blueHands = new Video(videos.get("assets/videos/Blue-Hands.mp4"), frame.x + 55, frame.y + 55, 0.59, "DO_NOTHING");
    blueHands.draw = (p5) => {
      if (playbackSpeed != 0 && playbackSpeed != 1) {
        const difSinceLastFrame = playbackSpeed * p5.deltaTime / 1000;
        timeSinceLastUpdate += difSinceLastFrame;

        if (!blueHands.vid.elt.seeking) {
          const newTime = blueHands.vid.time() + timeSinceLastUpdate;
          blueHands.vid.time(newTime);
          timeSinceLastUpdate = 0;
        }
      }
      p5.image(blueHands.vid, blueHands.x, blueHands.y, blueHands.width, blueHands.height);
    }
    blueHands.play();
    blueHands.pause(); // Playing and pausing so Chrome loads the first frame.

    blackBackground = new SceneObject(blueHands.x, blueHands.y, blueHands.width, blueHands.height, "DO_NOTHING");
    blackBackground.draw = (p5) => { 
      p5.fill(0);
      p5.rect(blackBackground.x, blackBackground.y, blackBackground.width, blackBackground.height);
    };

    // CLOSEUP SCENES
    orangeCloseup = createCloseupScene("assets/zoomed_images/orange_with_larva.png", "RETURN_ORANGE");
    dogFoodCloseup = createCloseupScene("assets/zoomed_images/dog_food.png", "RETURN_DOG_FOOD");

    portraitCloseup = createCloseupScene("assets/zoomed_images/wall_background.png", "RETURN_PORTRAIT");
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.png"), 500, 70, 0.4, "DO_NOTHING"));

    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_white_part.png"), 713, 331, 0.06, "DO_NOTHING"), true);
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_skin_outline.png"), 708, 328, 0.06, "DO_NOTHING"), true);
    const leftIris = new Image(images.get("assets/zoomed_images/eye_brown_circle.png"), 730, 336, 0.025, "DO_NOTHING");
    leftIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(leftIris.img, leftIris.x + dx, leftIris.y + dy, leftIris.width, leftIris.height);
    }
    portraitCloseup.addObject(leftIris, true);

    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_white_part.png"), 798, 327, 0.06, "DO_NOTHING"), true);
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_skin_outline.png"), 793, 324, 0.06, "DO_NOTHING"), true);
    const rightIris = new Image(images.get("assets/zoomed_images/eye_brown_circle.png"), 814, 333, 0.025, "DO_NOTHING");
    rightIris.draw = (p5) => {
      const factor = 1000;
      const dx = (p5.mouseX - p5.width / 2) / factor;
      const dy = (p5.mouseY - p5.height / 2) / factor;
      p5.image(rightIris.img, rightIris.x + dx, rightIris.y + dy, rightIris.width, rightIris.height);
    }
    portraitCloseup.addObject(rightIris, true);

    // SOUNDS
    fridge = sounds.get("assets/sounds/fridge.wav");
    eating = sounds.get("assets/sounds/eating.wav");
    larva = sounds.get("assets/sounds/slimy.wav");
    blow = sounds.get("assets/sounds/blow.wav");
    paper = sounds.get("assets/sounds/paper.wav");

    // Insert start screen to main scene
    insertBlurLayer();
    roomOverview.addObject(intro);
    roomOverview.addObject(start);

    // Create canvas and start the main scene.
    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();
    canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);
    startScene(roomOverview);
  }

  p5.draw = () => {
    activeScene.draw(p5);
  }

  p5.mouseMoved = () => {
    if (!activeScene) {
      return;
    }
    activeScene.preSelect(p5.mouseX, p5.mouseY);
  }

  p5.mouseClicked = () => {
    if (!activeScene) {
      return;
    }
    const message = activeScene.mouseClicked();

    switch (message) {
      case "START":
        roomOverview.removeObject(start);
        roomOverview.removeObject(intro);
        roomOverview.removeObject(blurLayer);
        fridge.setVolume(0);
        fridge.loop();
        fridge.setVolume(1, audioFadeDuration);
        break;
      case "IMAGE_BIRTHDAY":
        insertInvisibleLayer();
        showPopupImage(birthdayDrawing);
        fridge.setVolume(0);
        blow.play();
        break;
      case "IMAGE_NOTE":
        insertInvisibleLayer();
        fridge.setVolume(0);
        paper.play();
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
        fridge.setVolume(1);
        break;
      case "VIDEO_CONDOM":
        fridge.setVolume(0, audioFadeDuration);
        startPopupVideo(balloonBlowing);
        break;
      case "VIDEO_PIANO":
        fridge.setVolume(0, audioFadeDuration);
        startPopupVideo(piano);
        break;
      case "VIDEO_TEATIME":
        fridge.setVolume(0, audioFadeDuration);
        startPopupVideo(teaTime);
        break;
      case "VIDEO_REMOVE":
        fridge.setVolume(1, audioFadeDuration);
        popupVideo.stop();
        roomOverview.removeObject(popupVideo);
        roomOverview.removeObject(blurLayer);
        break;
      case "PLAYER_RUN":
        playbackSpeed = 0;
        blurLayer.onClickMessage = "PLAYER_CLOSE";
        blurLayer.update(p5.width / sceneWidth);
        roomOverview.addObject(blurLayer);
        blackBackground.update(p5.width / sceneWidth);
        roomOverview.addObject(blackBackground);
        [blueHands, frame, playbackIndicator, rewind, play, pause, stop, fastForward].forEach(obj => {
          obj.update(p5.width / sceneWidth);
          roomOverview.addObject(obj, true);
        });
        fridge.setVolume(0, audioFadeDuration);
        break;
      case "PLAYER_CLOSE":
        blueHands.vid.elt.onseeked = null;
        blueHands.pause();
        [blackBackground, blurLayer, blueHands, frame, playbackIndicator, rewind, play, pause, stop, fastForward].forEach(obj => {
          roomOverview.removeObject(obj);
        });
        blurLayer.onClickMessage = "VIDEO_REMOVE";
        fridge.setVolume(1, audioFadeDuration);
        break;
      case "PLAYER_REWIND":
        blueHands.pause();
        if (playbackSpeed == -4) {
          playbackSpeed = -8;
        } else {
          playbackSpeed = -4;
        }
        break;
      case "PLAYER_FASTFORWARD":
        blueHands.pause();
        if (playbackSpeed == 4) {
          playbackSpeed = 8;
        } else {
          playbackSpeed = 4;
        }
        break;
      case "PLAYER_PLAY":
        playbackSpeed = 1;
        if (blueHands.vid.elt.seeking)
        {
          blueHands.vid.elt.onseeked = () => {
            blueHands.play();
            blueHands.vid.elt.onseeked = null;
          };
        } else {
          blueHands.play();
        }
        break;
      case "PLAYER_PAUSE":
        playbackSpeed = 0;
        blueHands.pause();
        break;
      case "PLAYER_STOP":
        playbackSpeed = 0;
        blueHands.stop();
        break;
      case "CLOSEUP_DOG_FOOD":
        fridge.setVolume(0, audioFadeDuration);
        eating.loop();
        startScene(dogFoodCloseup);
        break;
      case "CLOSEUP_ORANGE":
        fridge.setVolume(0, audioFadeDuration);
        larva.loop();
        startScene(orangeCloseup);
        break;
      case "CLOSEUP_PORTRAIT":
        fridge.setVolume(0);
        startScene(portraitCloseup);
        break;
      case "RETURN_DOG_FOOD":
        fridge.setVolume(1, audioFadeDuration);
        eating.stop();
        startScene(roomOverview);
        break;
      case "RETURN_ORANGE":
        fridge.setVolume(1, audioFadeDuration);
        larva.stop();
        startScene(roomOverview);
        break;
      case "RETURN_PORTRAIT":
        fridge.setVolume(1);
        startScene(roomOverview);
        break;
      case "DO_NOTHING":
      case "":
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

  /**
   * Calculates the canvas size and position
   * The canvas should be centered and fill as much of the window as possible
   * while maintaing the aspect ratio.
   * @returns the canvas size and position.
   */
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

  // 
  /**
   * Calculates scale for background so it fills the scene
   * @param {number} currentWidth 
   * @param {number} currentHeight 
   * @returns the background scale
   */
  function calculateBackgroundScale(currentWidth, currentHeight) {
    const sceneToImageWidthRatio = sceneWidth / currentWidth;
    const sceneToImageHeightRatio = sceneHeight / currentHeight;

    if (sceneToImageWidthRatio > sceneToImageHeightRatio) {
      return sceneToImageWidthRatio;
    }
    return sceneToImageHeightRatio;
  }

  /**
   * Creates a popup image object
   * @param {string} path 
   * @param {number} imageToSceneHeightRatio 
   * @param {string} message 
   * @returns the popup image object
   */
  function createPopupImageObject(path, imageToSceneHeightRatio, message) {
    const img = images.get(path);
    const scale = imageToSceneHeightRatio * sceneHeight / img.height;
    const x = (sceneWidth - scale * img.width) / 2;
    const y = (sceneHeight - scale * img.height) / 2;
    return new Image(img, x, y, scale, message);
  }

  /**
   * Creates a popup video object
   * @param {string} path 
   * @returns the popup video object
   */
  function createPopupVideoObject(path) {
    const vid = videos.get(path);
    const scale = 0.8 * sceneWidth / videoWidth;
    const x = (sceneWidth - scale * videoWidth) / 2;
    const y = (sceneHeight - scale * videoHeight) / 2;
    return new Video(vid, x, y, scale, "DO_NOTHING");
  }

  /**
   * Creates a closeup scene with a background and a return button.
   * @param {string} path 
   * @param {string} message 
   * @returns the scene
   */
  function createCloseupScene(path, message) {
    const scene = new Scene();
    const backgroundImg = images.get(path);
    const scale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    scene.addObject(new Image(backgroundImg, 0, 0, scale, "DO_NOTHING"));
    scene.addObject(new Image(images.get("assets/zoomed_images/back_button.png"), 50, 50, 0.22, message));
    return scene;
  }

  /**
   * Starts a scene.
   * @param {Scene} scene 
   */
  function startScene(scene) {
    scene.update(p5.width / sceneWidth);
    activeScene = scene;
  }

  /**
   * Inserts the inivisible layer to the main scene.
   */
  function insertInvisibleLayer() {
    invisibleLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(invisibleLayer);
  }

  /**
   * Inserts the inivisible layer to the main scene
   */
  function insertBlurLayer() {
    blurLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(blurLayer);
  }

  /**
   * Shows a pop-up image.
   * @param {Image} img 
   */
  function showPopupImage(img) {
    img.update(p5.width / sceneWidth);
    popupImage = img;
    roomOverview.addObject(popupImage);
  }

  /**
   * Starts a pop-up video
   * @param {Video} video 
   */
  function startPopupVideo(video) {
    insertBlurLayer();
    video.update(p5.width / sceneWidth);
    popupVideo = video;
    roomOverview.addObject(popupVideo, true);
    popupVideo.loop();
  }

  /**
   * Draws the playback indicator
   */
  function drawPlayBackIndicator()
  {
    switch(playbackSpeed) {
      case 0:
        p5.fill(255);
        p5.rect(playbackIndicator.x, playbackIndicator.y, playbackIndicator.width / 3, playbackIndicator.height);
        p5.rect(playbackIndicator.x + playbackIndicator.width * 2 / 3, playbackIndicator.y, playbackIndicator.width / 3, playbackIndicator.height);
        break;
      case 4:
        p5.fill(255);
        p5.triangle(playbackIndicator.x, playbackIndicator.y,
                    playbackIndicator.x, playbackIndicator.y + playbackIndicator.height,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y + playbackIndicator.height / 2);
        p5.triangle(playbackIndicator.x + 1.2 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 1.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height / 2);
        break;
      case 8:
        p5.fill(255);
        p5.triangle(playbackIndicator.x, playbackIndicator.y,
                    playbackIndicator.x, playbackIndicator.y + playbackIndicator.height,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y + playbackIndicator.height / 2);
        p5.triangle(playbackIndicator.x + 1.2 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 1.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height / 2);
        p5.triangle(playbackIndicator.x + 2.4 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 2.4 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height,
                    playbackIndicator.x + 3.4 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height / 2);
        break;
      case -4:
        p5.fill(255);
        p5.triangle(playbackIndicator.x, playbackIndicator.y + playbackIndicator.height / 2,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y + playbackIndicator.height);
        p5.triangle(playbackIndicator.x + 1.2 * playbackIndicator.width,playbackIndicator.y + playbackIndicator.height / 2,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height);
        break;
      case -8:
        p5.fill(255);
        p5.triangle(playbackIndicator.x, playbackIndicator.y + playbackIndicator.height / 2,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + playbackIndicator.width, playbackIndicator.y + playbackIndicator.height);
        p5.triangle(playbackIndicator.x + 1.2 * playbackIndicator.width,playbackIndicator.y + playbackIndicator.height / 2,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 2.2 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height);
        p5.triangle(playbackIndicator.x + 2.4 * playbackIndicator.width,playbackIndicator.y + playbackIndicator.height / 2,
                    playbackIndicator.x + 3.4 * playbackIndicator.width, playbackIndicator.y,
                    playbackIndicator.x + 3.4 * playbackIndicator.width, playbackIndicator.y + playbackIndicator.height);
        break;
    }
  }
});
