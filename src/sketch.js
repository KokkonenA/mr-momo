import Image from "./Image.js";
import Scene from "./Scene.js";
import SceneObject from "./SceneObject.js";
import Video from "./Video.js";

new p5((p5) => {
  const images = new Map();
  const sounds = new Map();
  const videos = new Map();

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

    roomOverview.addObject(new Image(images.get("assets/old_tv.png"), 350, 250, 0.4, "PLAYER_RUN"));
    roomOverview.addObject(new Image(images.get("assets/cake.png"), 530, 500, 0.25, "IMAGE_BIRTHDAY"));
    roomOverview.addObject(new Image(images.get("assets/tea_mug.png"), 700, 400, 0.4, "VIDEO_TEATIME"));
    roomOverview.addObject(new Image(images.get("assets/letter.png"), 1050, 430, 0.4, "IMAGE_NOTE"));

    const table = new Image(images.get("assets/table.png"), 800, 300, 0.4, "table");
    table.isMouseOver = () => { return false };
    roomOverview.addObject(table);

    roomOverview.addObject(new Image(images.get("assets/cd_player.png"), 950, 330, 0.4, "VIDEO_PIANO"));
    roomOverview.addObject(new Image(images.get("assets/portrait.png"), 1100, 50, 0.4, "CLOSEUP_PORTRAIT"));
    roomOverview.addObject(new Image(images.get("assets/orange.png"), 200, 750, 0.4, "CLOSEUP_ORANGE"));
    roomOverview.addObject(new Image(images.get("assets/mr.momo.png"), 600, 650, 0.4, "Momo: ..."));
    roomOverview.addObject(new Image(images.get("assets/rug.png"), 1150, 430, 0.4, "DO_NOTHING"));
    roomOverview.addObject(new Image(images.get("assets/r_u_ok.png"), 1400, 550, 0.4, "DO_NOTHING"));

    const foodBowl = new Image(images.get("assets/dog_food.png"), 1330, 550, 0.4, "CLOSEUP_DOG_FOOD");
    foodBowl.isMouseOver = (x, y) => {
      return  x > foodBowl.x && x < foodBowl.x + foodBowl.width * 2 / 3 &&
              y > foodBowl.y && y < foodBowl.y + foodBowl.height;
    }
    roomOverview.addObject(foodBowl);

    roomOverview.addObject(new Image(images.get("assets/used_condom.png"), 1400, 800, 0.4, "VIDEO_CONDOM"));

    // POPUP IMAGES
    invisibleLayer = new SceneObject(0, 0, sceneWidth, sceneHeight, "IMAGE_REMOVE");
    invisibleLayer.draw = () => { return };

    birthdayDrawing = createPopupImageObject("assets/zoomed_images/birthday.png", 0.9, "DO_NOTHING");
    note = createPopupImageObject("assets/zoomed_images/note.png", 0.6, "IMAGE_NOTE_TRANSLATED");
    noteTranslated = createPopupImageObject("assets/zoomed_images/note_translated.png", 0.6, "IMAGE_NOTE_ORIGINAL");

    // POPUP VIDEOS
    // Videos are created the first time they are played in p5.mouseClicked().
    blurLayer = new SceneObject(0, 0, sceneWidth, sceneHeight, "VIDEO_REMOVE");
    blurLayer.draw = (p5) => { p5.filter(p5.BLUR, 3); }

    // POPUP PLAYER
    frame = createPopupImageObject("assets/player/frame.png", 0.9, "DO_NOTHING");
    playbackIndicator = new SceneObject(frame.x + 80, frame.y + 80, 30, 30, "DO_NOTHING");
    playbackIndicator.draw = (p5) => {
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

    rewind = new Image(images.get("assets/player/rewind_button.png"), 580, 750, 0.2, "PLAYER_REWIND");
    play = new Image(images.get("assets/player/play_button.png"), 680, 750, 0.2, "PLAYER_PLAY");
    pause = new Image(images.get("assets/player/pause_button.png"), 780, 750, 0.2, "PLAYER_PAUSE");
    stop = new Image(images.get("assets/player/stop_button.png"), 880, 750, 0.2, "PLAYER_STOP");
    fastForward = new Image(images.get("assets/player/fast_forward_button.png"), 980, 750, 0.2, "PLAYER_FASTFORWARD");
    playbackSpeed = 0;
    timeSinceLastUpdate = 0;

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
        if (!balloonBlowing)
        {
          balloonBlowing = createPopupVideoObject("assets/videos/condom.mp4");
        }
        startPopupVideo(balloonBlowing);
        break;
      case "VIDEO_PIANO":
        if (!piano)
        {
          piano = createPopupVideoObject("assets/videos/olenyksin.mp4");
        }
        startPopupVideo(piano);
        break;
      case "VIDEO_TEATIME":
        if (!teaTime)
        {
          teaTime = createPopupVideoObject("assets/videos/tea_time.mp4");
        }
        startPopupVideo(teaTime);
        break;
      case "VIDEO_REMOVE":
        popupVideo.stop();
        roomOverview.removeObject(popupVideo);
        roomOverview.removeObject(blurLayer);
        break;
      case "PLAYER_RUN":
        if (!blueHands)
        {
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
        }
        playbackSpeed = 0;
        blurLayer.message = "PLAYER_CLOSE";
        blurLayer.update(p5.width / sceneWidth);
        roomOverview.addObject(blurLayer);
        blackBackground.update(p5.width / sceneWidth);
        roomOverview.addObject(blackBackground);
        [blueHands, frame, playbackIndicator, rewind, play, pause, stop, fastForward].forEach(obj => {
          obj.update(p5.width / sceneWidth);
          roomOverview.addObject(obj, true);
        });
        break;
      case "PLAYER_CLOSE":
        blueHands.vid.elt.onseeked = null;
        blueHands.pause();
        [blackBackground, blurLayer, blueHands, frame, playbackIndicator, rewind, play, pause, stop, fastForward].forEach(obj => {
          roomOverview.removeObject(obj);
        });
        blurLayer.message = "VIDEO_REMOVE";
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
    return new Image(img, x, y, scale, message);
  }

  // Create and return a popup video object.
  function createPopupVideoObject(path) {
    const vid = videos.get(path);
    const scale = 0.8 * sceneWidth / vid.width;
    const x = (sceneWidth - scale * vid.width) / 2;
    const y = (sceneHeight - scale * vid.height) / 2;
    return new Video(vid, x, y, scale, "DO_NOTHING");
  }

  // Create and return a closeup scene with a background and return button.
  function createCloseupScene(path, message) {
    const scene = new Scene();
    const backgroundImg = images.get(path);
    const scale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    scene.addObject(new Image(backgroundImg, 0, 0, scale, "DO_NOTHING"));
    scene.addObject(new Image(images.get("assets/zoomed_images/back_button.png"), 50, 50, 0.22, message));
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
    popupVideo.loop();
  }
});
