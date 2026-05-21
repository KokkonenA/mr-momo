"use strict";

import HImage from "./classes/HImage.js"
import Image from "./classes/Image.js";
import Iris from "./classes/Iris.js";
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

  let blurLayer; // Layer between the room overview and a pop-up that blurs the background and catches click events.

  // Pop-up images
  let birthdayDrawing;
  let note;
  let noteEnglish;
  let noteKorean;
  let currentNote; // The actively displayed note.
  let translateButton;
  let info;
  let intro;
  let startButton;

  // Pop-up videos
  let teaVideo;
  let condomVideo;
  let pianoVideo;

  // Video player
  let frame;
  let rewindButton;
  let playButton;
  let pauseButton;
  let stopButton;
  let fastforwardButton;
  let blueHandsVideo;
  let playbackSpeed;
  let playbackIndicator;
  let blackBackground; // Sometimes the video frame is not drawn showing the room overview below.
  let timeSinceLastUpdate;

  // Sounds
  let fridge;
  let fridgeLower;
  let eating;
  let larva;
  let blow;
  let paper;

  //Links
  let heya
  let antti

  p5.preload = () => {
    p5.loadJSON("assetLists.json", (assetLists) => {
      for (let path of assetLists.images) {
        images.set(path, p5.loadImage(path));
      }
      for (let path of assetLists.sounds) {
        sounds.set(path, p5.loadSound(path));
      }
      for (let path of assetLists.videos) {
        const video = p5.createVideo(path);
        video.hide();
        videos.set(path, video);
      }
    })
  }

  p5.setup = () => {
    // ROOM OVERVIEW
    roomOverview = new Scene();

    const backgroundImg = images.get("assets/walls.webp");
    const backgroundScale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    roomOverview.addObject(new Image(backgroundImg, 0, 0, backgroundScale));

    roomOverview.addObject(new class extends HImage {
      click = openVideoPlayer;
    }(images.get("assets/old_tv.webp"), images.get("assets/old_tv__outlined.webp"), 350, 250, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = showBirthdayDrawing;
    }(images.get("assets/cake.webp"), images.get("assets/cake__outlined.webp"), 530, 500, 0.25));

    roomOverview.addObject(new class extends HImage {
      click = showTeaVideo;
    }(images.get("assets/tea_mug.webp"), images.get("assets/tea_mug__outlined.webp"), 700, 400, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = showNote;
    }(images.get("assets/letter.webp"), images.get("assets/letter__outlined.webp"), 1050, 400, 0.4));

    roomOverview.addObject(new class extends Image {
      isMouseOver = () => { return false; }
    }(images.get("assets/table.webp"), 800, 300, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = showPianoVideo;
    }(images.get("assets/cd_player.webp"), images.get("assets/cd_player__outlined.webp"), 950, 320, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = switchToPortraitCloseup;
    }(images.get("assets/portrait.webp"), images.get("assets/portrait__outlined.webp"), 1100, 50, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = switchToOrangeCloseup;
    }(images.get("assets/orange.webp"), images.get("assets/orange__outlined.webp"), 200, 750, 0.4));

    roomOverview.addObject(new class extends Image {
      click = () => { console.log("Momo: ..."); }
    }(images.get("assets/mr.momo.webp"), 600, 650, 0.4));

    roomOverview.addObject(new Image(images.get("assets/rug.webp"), 1150, 430, 0.4));
    roomOverview.addObject(new Image(images.get("assets/r_u_ok.webp"), 1400, 550, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = switchToDogFoodCloseUp;
    }(images.get("assets/dog_food.webp"), images.get("assets/dog_food__outlined.webp"), 1320, 550, 0.4));

    roomOverview.addObject(new class extends HImage {
      click = showCondomVideo;
    }(images.get("assets/used_condom.webp"), images.get("assets/used_condom__outlined.webp"), 1400, 770, 0.4));

    roomOverview.addObject(new class extends Image {
      click = showInfo;
    }(images.get("assets/zoomed_images/question_button.webp"), 1520, 20, 0.12))

    blurLayer = new class extends SceneObject {
      draw = (p5) => { p5.filter(p5.BLUR, 3); }
    }(0, 0, sceneWidth, sceneHeight);

    // POPUP IMAGES
    birthdayDrawing = createPopupImage("assets/zoomed_images/birthday.webp", 0.9);

    note = createPopupImage("assets/zoomed_images/note.webp", 0.6);
    noteEnglish = createPopupImage("assets/zoomed_images/note_english.webp", 0.6);
    noteKorean = createPopupImage("assets/zoomed_images/note_korean.webp", 0.6);

    translateButton = new class extends Image {
      click = switchNoteTranslation;
    }(images.get("assets/zoomed_images/translate_button.webp"), 1300, 200, 0.17);

    const img = images.get("assets/zoomed_images/info.webp");
    const scale = 0.8 * sceneHeight / img.height;
    const x = (sceneWidth - scale * img.width) / 2;
    const y = (sceneHeight - scale * img.height) / 2;

    info = new class extends Image {
      update = (scale) => {
        super.update(scale);
        heya.position(canvas.x + this.x + 0.09 * this.width, canvas.y + this.y + 0.74 * this.height);
        heya.size(0.22 * this.width, 0.04 * this.height);
        antti.position(canvas.x + this.x + 0.09 * this.width, canvas.y + this.y + 0.78 * this.height);
        antti.size(0.35 * this.width, 0.04 * this.height);
      }
    }(img, x, y, scale);

    // POPUP VIDEOS
    condomVideo = createPopupVideo("assets/videos/condom.mp4");
    pianoVideo = createPopupVideo("assets/videos/olenyksin.mp4");
    teaVideo = createPopupVideo("assets/videos/tea_time.mp4");

    // POPUP PLAYER
    frame = createPopupImage("assets/player/frame.webp", 0.9);

    playbackIndicator = new class extends SceneObject {
      draw = (p5) => {
        drawPlaybackIndicator(p5, this.x, this.y, this.width, this.height, playbackSpeed);
      }
    }(frame.x + 80, frame.y + 80, 30, 30);

    rewindButton = new class extends Image {
      click = rewindBlueHandsVideo;
    }(images.get("assets/player/rewind_button.webp"), 580, 750, 0.2);

    playButton = new class extends Image {
      click = playBlueHandsVideo;
    }(images.get("assets/player/play_button.webp"), 680, 750, 0.2);

    pauseButton = new class extends Image {
      click = pauseBlueHandsVideo;
    }(images.get("assets/player/pause_button.webp"), 780, 750, 0.2);

    stopButton = new class extends Image {
      click = stopBlueHandsVideo;
    }(images.get("assets/player/stop_button.webp"), 880, 750, 0.2);

    fastforwardButton = new class extends Image {
      click = fastforwardBlueHandsVideo;
    }(images.get("assets/player/fast_forward_button.webp"), 980, 750, 0.2,);
    
    playbackSpeed = 0;
    timeSinceLastUpdate = 0;

    blueHandsVideo = new class extends Video {
      draw = (p5) => {
        if (playbackSpeed != 0 && playbackSpeed != 1) {
          const difSinceLastFrame = playbackSpeed * p5.deltaTime / 1000;
          timeSinceLastUpdate += difSinceLastFrame;

          if (!this.vid.elt.seeking) {
            const newTime = this.vid.time() + timeSinceLastUpdate;
            this.vid.time(newTime);
            timeSinceLastUpdate = 0;
          }
        }
        p5.image(this.vid, this.x, this.y, this.width, this.height);
      }
    }(videos.get("assets/videos/Blue-Hands.mp4"), frame.x + 55, frame.y + 55, 0.59);

    blackBackground = new class extends SceneObject {
      draw = (p5) => {
        p5.fill(0);
        p5.rect(this.x, this.y, this.width, this.height);
      }
    }(blueHandsVideo.x, blueHandsVideo.y, blueHandsVideo.width, blueHandsVideo.height);

    // CLOSEUP SCENES
    orangeCloseup = createCloseupScene("assets/zoomed_images/orange_with_larva.webp", returnFromOrangeCloseup);
    dogFoodCloseup = createCloseupScene("assets/zoomed_images/dog_food.webp", returnFromDogFoodCloseup);
    portraitCloseup = createCloseupScene("assets/zoomed_images/wall_background.webp", returnFromPortraitCloseup);

    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/portrait_zoomed_empty_eyes.webp"), 500, 70, 0.4));
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_white_part.webp"), 713, 331, 0.06), true);
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_skin_outline.webp"), 708, 328, 0.06), true);
    portraitCloseup.addObject(new Iris(images.get("assets/zoomed_images/eye_brown_circle.webp"), 730, 336, 0.025), true);
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_white_part.webp"), 798, 327, 0.06), true);
    portraitCloseup.addObject(new Image(images.get("assets/zoomed_images/eye_skin_outline.webp"), 793, 324, 0.06), true);
    portraitCloseup.addObject(new Iris(images.get("assets/zoomed_images/eye_brown_circle.webp"), 814, 333, 0.025), true);

    // SOUNDS
    fridge = sounds.get("assets/sounds/fridge.m4a");
    fridge.setVolume(0);
    fridgeLower = sounds.get("assets/sounds/fridge_lower.m4a");
    eating = sounds.get("assets/sounds/eating.m4a");
    larva = sounds.get("assets/sounds/slimy.m4a");
    blow = sounds.get("assets/sounds/blow.m4a");
    paper = sounds.get("assets/sounds/paper.m4a");

    // LINKS
    heya = p5.createA("https://heya.world/", "", "_blank");
    //heya.style('background', 'rgba(0,0,0,0.5)');
    heya.hide();

    antti = p5.createA("https://github.com/KokkonenA/mr-momo", "", "_blank");
    //antti.style('background', 'rgba(0,0,0,0.5)');
    antti.hide();

    // Insert start screen to room overview.
    intro = new Image(images.get("assets/zoomed_images/intro.webp"), 490, 280, 0.4);

    startButton = new class extends Image {
      click = begin;
    }(images.get("assets/player/play_button.webp"), 760, 550, 0.2);

    insertBlurLayer();
    roomOverview.addObject(intro);
    roomOverview.addObject(startButton);

    // Create canvas and starts the room overview scene.
    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();
    canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.position(canvasX, canvasY);
    startScene(roomOverview);
  }

  p5.draw = () => {
    activeScene?.draw(p5);
  }

  p5.mouseMoved = () => {
    activeScene?.preSelect(p5.mouseX, p5.mouseY);
  }

  p5.mouseClicked = () => {
    activeScene?.mouseClicked();
  }

  p5.windowResized = () => {
    if (!canvas) {
      return;
    }
    
    const [canvasX, canvasY, canvasWidth, canvasHeight] = calculateCanvasPositionAndSize();
    canvas.position(canvasX, canvasY);
    p5.resizeCanvas(canvasWidth, canvasHeight);

    activeScene.update(canvasWidth / sceneWidth);
  }

  /**
   * Hides the intro message and starts the background sound.
   */
  function begin() {
    roomOverview.removeObject(startButton);
    roomOverview.removeObject(intro);
    roomOverview.removeObject(blurLayer);
    fridge.loop();
    fridge.setVolume(1, audioFadeDuration);
  }

  /**
   * Shows the birthday drawing.
   */
  function showBirthdayDrawing() {
    showPopupImage(birthdayDrawing, hideBirthdayDrawing);
    fridge.setVolume(0);
    blow.play();
  }

  function hideBirthdayDrawing() {
    hidePopupImage(birthdayDrawing);
  }

  /**
   * Shows the note and the translate button.
   */
  function showNote() {
    currentNote = note;
    showPopupImage(currentNote, hideNote);
    translateButton.update(p5.width / sceneWidth);
    roomOverview.addObject(translateButton);
    fridge.setVolume(0);
    paper.play();
  }

  /**
   * Hides the note and the translate button.
   */
  function hideNote() {
    roomOverview.removeObject(translateButton);
    hidePopupImage(currentNote);
  }

  /**
   * Switches to the next translation of the note or back to the original one.
   */
  function switchNoteTranslation() {
    let nextNote;

    switch (currentNote) {
      case note:
        nextNote = noteEnglish;
        break;
      case noteEnglish:
        nextNote = noteKorean;
        break;
      default:
        nextNote = note;
        break;
    }
    
    roomOverview.removeObject(currentNote);
    nextNote.update(p5.width / sceneWidth);
    roomOverview.addObject(nextNote);
    currentNote = nextNote;
  }

  /**
   * Shows info about the work.
   */
  function showInfo() {
    showPopupImage(info, hideInfo);
    heya.show();
    antti.show();
    fridge.setVolume(0);
  }

  /**
   * Hides the info about the work.
   */
  function hideInfo() {
    heya.hide();
    antti.hide();
    hidePopupImage(info);
  }

  /**
   * Shows the condom video.
   */
  function showCondomVideo() {
    showPopupVideo(condomVideo, hideCondomVideo);
  }

  /**
   * Hides the condom video.
   */
  function hideCondomVideo() {
    hidePopupVideo(condomVideo);
  }

  /**
   * Show the piano video.
   */
  function showPianoVideo() {
    showPopupVideo(pianoVideo, hidePianoVideo);
  }

  /**
   * Hides the piano video.
   */
  function hidePianoVideo() {
    hidePopupVideo(pianoVideo);
  }

  /**
   * Shows the tea video.
   */
  function showTeaVideo() {
    showPopupVideo(teaVideo, hideTeaVideo);
  }

  /**
   * Hides the tea video.
   */
  function hideTeaVideo() {
    hidePopupVideo(teaVideo);
  }

  /**
   * Opens the video player.
   */
  function openVideoPlayer() {
    playbackSpeed = 0;
    blurLayer.click = closeVideoPlayer;
    blurLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(blurLayer);
    blackBackground.update(p5.width / sceneWidth);
    roomOverview.addObject(blackBackground);
    [blueHandsVideo, frame, playbackIndicator, rewindButton, playButton, pauseButton, stopButton, fastforwardButton].forEach(obj => {
      obj.update(p5.width / sceneWidth);
      roomOverview.addObject(obj, true);
    });
    fridge.setVolume(0, audioFadeDuration);
  }

  /**
   * Closes the video player.
   */
  function closeVideoPlayer() {
    blueHandsVideo.vid.elt.onseeked = null;
    blueHandsVideo.pause();
    [blackBackground, blurLayer, blueHandsVideo, frame, playbackIndicator, rewindButton, playButton, pauseButton, stopButton, fastforwardButton].forEach(obj => {
      roomOverview.removeObject(obj);
    });
    fridge.setVolume(1, audioFadeDuration);
  }

  /**
   * Rewinds the Blue Hands video.
   */
  function rewindBlueHandsVideo() {
    blueHandsVideo.pause();
    if (playbackSpeed == -4) {
      playbackSpeed = -8;
    } else {
      playbackSpeed = -4;
    }
  }
  
  /**
   * Fast-forwards the Blue Hands video.
   */
  function fastforwardBlueHandsVideo() {
    blueHandsVideo.pause();
    if (playbackSpeed == 4) {
      playbackSpeed = 8;
    } else {
      playbackSpeed = 4;
    }
  }

  /**
   * Plays the Blue Hands video.
   */
  function playBlueHandsVideo() {
    playbackSpeed = 1;
    if (blueHandsVideo.vid.elt.seeking)
    {
      blueHandsVideo.vid.elt.onseeked = () => {
        blueHandsVideo.play();
        blueHandsVideo.vid.elt.onseeked = null;
      };
    } else {
      blueHandsVideo.play();
    }
  }

  /**
   * Pauses the Blue Hands video.
   */
  function pauseBlueHandsVideo() {
    playbackSpeed = 0;
    blueHandsVideo.pause();
  }

  /**
   * Stops the Blue Hands video.
   */
  function stopBlueHandsVideo() {
    playbackSpeed = 0;
    blueHandsVideo.stop();
  }

  /**
   * Switches to the dog food close-up.
   */
  function switchToDogFoodCloseUp() {
    fridge.setVolume(0, audioFadeDuration);
    eating.loop();
    startScene(dogFoodCloseup);
  }

  /**
   * Returns from the dog food close-up to the room overview.
   */
  function returnFromDogFoodCloseup() {
    eating.stop();
    fridge.setVolume(1, audioFadeDuration);
    startScene(roomOverview);
  }

  /**
   * Switches to the orange close-up.
   */
  function switchToOrangeCloseup() {
    fridge.setVolume(0, audioFadeDuration);
    larva.loop();
    startScene(orangeCloseup);
  }

  /**
   * Returns from the orange close-up to the room overview.
   */
  function returnFromOrangeCloseup() {
    larva.stop();
    fridge.setVolume(1, audioFadeDuration);
    startScene(roomOverview);
  }

  /**
   * Switches to the portrait close-up.
   */
  function switchToPortraitCloseup() {
    fridge.setVolume(0);
    fridgeLower.loop();
    startScene(portraitCloseup);
  }

  /**
   * Return from the portrait close-up to the room overview. 
   */
  function returnFromPortraitCloseup() {
    fridgeLower.stop();
    fridge.setVolume(1);
    startScene(roomOverview);
  }

  function drawPlaybackIndicator(p5, x, y, width, height, playbackSpeed) {
    p5.fill(255);

    switch (playbackSpeed) {
      case 0:
        drawPauseIcon(p5, x, y, width, height);
        break;
      case 4:
        drawFastforwardIcon(p5, x, y, width, height, 2);
        break;
      case 8:
        drawFastforwardIcon(p5, x, y, width, height, 3);
        break;
      case -4:
        drawRewindIcon(p5, x, y, width, height, 2);
        break;
      case -8:
        drawRewindIcon(p5, x, y, width, height, 3);
        break;
      default:
        break;
    }
  }

  function drawPauseIcon(p5, x, y, width, height) {
    p5.rect(x, y, width / 3, height);
    p5.rect(x + width * 2 / 3, y, width / 3, height);
  }

  function drawFastforwardIcon(p5, x, y, width, height, count) {
    const step = 1.2 * width;

    for (let i = 0; i < count; i++) {
      const offset = i * step;
      p5.triangle(
        x + offset,
        y,
        x + offset,
        y + height,
        x + offset + width,
        y + height / 2
      );
    }
  }

  function drawRewindIcon(p5, x, y, width, height, count) {
    const step = 1.2 * width;

    for (let i = 0; i < count; i++) {
      const offset = i * step;
      p5.triangle(
        x + offset,
        y + height / 2,
        x + offset + width,
        y,
        x + offset + width,
        y + height
      );
    }
  }

  /**
   * Calculates the canvas size and position
   * The canvas should be centered and fill as much of the window as possible
   * while maintaing the aspect ratio.
   * 
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
   * Calculates scale for background so it fills the scene.
   * 
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
   * 
   * @param {string} path 
   * @param {number} imageToSceneHeightRatio
   * @returns the popup image object
   */
  function createPopupImage(path, imageToSceneHeightRatio) {
    const img = images.get(path);
    const scale = imageToSceneHeightRatio * sceneHeight / img.height;
    const x = (sceneWidth - scale * img.width) / 2;
    const y = (sceneHeight - scale * img.height) / 2;
    return new Image(img, x, y, scale);
  }

  /**
   * Creates a popup video object
   * 
   * @param {string} path 
   * @returns the popup video object
   */
  function createPopupVideo(path) {
    const vid = videos.get(path);
    const scale = 0.8 * sceneWidth / videoWidth;
    const x = (sceneWidth - scale * videoWidth) / 2;
    const y = (sceneHeight - scale * videoHeight) / 2;
    return new Video(vid, x, y, scale);
  }

  /**
   * Creates a closeup scene with a background and a return button.
   *
   * @param {string} path 
   * @param {Function} onClick 
   * @returns the scene
   */
  function createCloseupScene(path, onClick) {
    const scene = new Scene();
    const backgroundImg = images.get(path);
    const scale = calculateBackgroundScale(backgroundImg.width, backgroundImg.height);
    scene.addObject(new Image(backgroundImg, 0, 0, scale));

    scene.addObject(new class extends Image {
      click = onClick;
    }(images.get("assets/zoomed_images/back_button.webp"), 50, 50, 0.2));

    return scene;
  }

  /**
   * Inserts the blur layer to the room overview.
   */
  function insertBlurLayer() {
    blurLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(blurLayer);
  }

  /**
   * Shows a pop-up image.
   * 
   * @param {Image} img
   * @param {Function} onHide
   */
  function showPopupImage(img, onHide) {
    blurLayer.click = onHide;
    insertBlurLayer();
    img.update(p5.width / sceneWidth);
    roomOverview.addObject(img);
  }

  /**
   * Hides a pop-up image.
   * 
   * @param {Image} img
   */
  function hidePopupImage(img) {
    roomOverview.removeObject(img);
    roomOverview.removeObject(blurLayer);
    fridge.setVolume(1);
  }

  /**
   * Shows a pop-up video and loops it.
   * 
   * @param {Video} video
   * @param {Function} onHide
   */
  function showPopupVideo(video, onHide) {
    fridge.setVolume(0, audioFadeDuration);
    blurLayer.click = onHide;
    insertBlurLayer();
    video.update(p5.width / sceneWidth);
    roomOverview.addObject(video, true);
    video.loop();
  }

  /**
   * Hides a pop-up video and stops it.
   * 
   * @param {Video} video
   */
  function hidePopupVideo(video) {
    fridge.setVolume(1, audioFadeDuration);
    video.stop();
    roomOverview.removeObject(video);
    roomOverview.removeObject(blurLayer);
  }

  /**
   * Starts a scene.
   * 
   * @param {Scene} scene 
   */
  function startScene(scene) {
    scene.update(p5.width / sceneWidth);
    activeScene = scene;
  }
});
