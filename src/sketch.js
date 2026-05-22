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
  let infoCard;
  let introCard;
  let startButton;

  // Pop-up videos
  let teaVideo;
  let condomVideo;
  let pianoVideo;

  // Video player
  let playerFrame;
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
  let fridgeAudio;
  let fridgeLowerAudio;
  let eatingAudio;
  let larvaAudio;
  let blowAudio;
  let paperAudio;

  //Links
  let heyaLink
  let anttiLink

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

    // POP-UP IMAGES
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

    infoCard = new class extends Image {
      update = (scale) => {
        super.update(scale);
        heyaLink.position(canvas.x + this.x + 0.09 * this.width, canvas.y + this.y + 0.74 * this.height);
        heyaLink.size(0.22 * this.width, 0.04 * this.height);
        anttiLink.position(canvas.x + this.x + 0.09 * this.width, canvas.y + this.y + 0.78 * this.height);
        anttiLink.size(0.35 * this.width, 0.04 * this.height);
      }
    }(img, x, y, scale);

    // POP-UP VIDEOS
    condomVideo = createPopupVideo("assets/videos/condom.mp4");
    pianoVideo = createPopupVideo("assets/videos/olenyksin.mp4");
    teaVideo = createPopupVideo("assets/videos/tea_time.mp4");

    // VIDEO PLAYER
    playerFrame = createPopupImage("assets/player/frame.webp", 0.9);

    playbackIndicator = new class extends SceneObject {
      draw = (p5) => {
        drawPlaybackIndicator(p5, this.x, this.y, this.width, this.height, playbackSpeed);
      }
    }(playerFrame.x + 80, playerFrame.y + 80, 30, 30);

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
    }(videos.get("assets/videos/Blue-Hands.mp4"), playerFrame.x + 55, playerFrame.y + 55, 0.59);

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
    fridgeAudio = sounds.get("assets/sounds/fridge.m4a");
    fridgeAudio.setVolume(0);
    fridgeLowerAudio = sounds.get("assets/sounds/fridge_lower.m4a");
    eatingAudio = sounds.get("assets/sounds/eating.m4a");
    larvaAudio = sounds.get("assets/sounds/slimy.m4a");
    blowAudio = sounds.get("assets/sounds/blow.m4a");
    paperAudio = sounds.get("assets/sounds/paper.m4a");

    // LINKS
    heyaLink = p5.createA("https://heya.world/", "", "_blank");
    //heya.style('background', 'rgba(0,0,0,0.5)');
    heyaLink.hide();

    anttiLink = p5.createA("https://github.com/KokkonenA/mr-momo", "", "_blank");
    //antti.style('background', 'rgba(0,0,0,0.5)');
    anttiLink.hide();

    // Insert intro card and start button to room overview.
    introCard = new Image(images.get("assets/zoomed_images/intro.webp"), 490, 280, 0.4);

    startButton = new class extends Image {
      click = begin;
    }(images.get("assets/player/play_button.webp"), 760, 550, 0.2);

    insertBlurLayer();
    roomOverview.addObject(introCard);
    roomOverview.addObject(startButton);

    // Create canvas and start room overview scene.
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
   * Hides intro card and starts fridge audio.
   */
  function begin() {
    roomOverview.removeObject(startButton);
    roomOverview.removeObject(introCard);
    roomOverview.removeObject(blurLayer);
    fridgeAudio.loop();
    fridgeAudio.setVolume(1, audioFadeDuration);
  }

  /**
   * Shows birthday drawing.
   */
  function showBirthdayDrawing() {
    showPopupImage(birthdayDrawing, hideBirthdayDrawing);
    fridgeAudio.setVolume(0);
    blowAudio.play();
  }

  function hideBirthdayDrawing() {
    hidePopupImage(birthdayDrawing);
  }

  /**
   * Shows note and translate button.
   */
  function showNote() {
    currentNote = note;
    showPopupImage(currentNote, hideNote);
    translateButton.update(p5.width / sceneWidth);
    roomOverview.addObject(translateButton);
    fridgeAudio.setVolume(0);
    paperAudio.play();
  }

  /**
   * Hides current note and translate button.
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
   * Shows info card.
   */
  function showInfo() {
    showPopupImage(infoCard, hideInfo);
    heyaLink.show();
    anttiLink.show();
    fridgeAudio.setVolume(0);
  }

  /**
   * Hides info card.
   */
  function hideInfo() {
    heyaLink.hide();
    anttiLink.hide();
    hidePopupImage(infoCard);
  }

  /**
   * Shows condom video.
   */
  function showCondomVideo() {
    showPopupVideo(condomVideo, hideCondomVideo);
  }

  /**
   * Hides condom video.
   */
  function hideCondomVideo() {
    hidePopupVideo(condomVideo);
  }

  /**
   * Show piano video.
   */
  function showPianoVideo() {
    showPopupVideo(pianoVideo, hidePianoVideo);
  }

  /**
   * Hides piano video.
   */
  function hidePianoVideo() {
    hidePopupVideo(pianoVideo);
  }

  /**
   * Shows tea video.
   */
  function showTeaVideo() {
    showPopupVideo(teaVideo, hideTeaVideo);
  }

  /**
   * Hides tea video.
   */
  function hideTeaVideo() {
    hidePopupVideo(teaVideo);
  }

  /**
   * Opens video player.
   */
  function openVideoPlayer() {
    playbackSpeed = 0;
    blurLayer.click = closeVideoPlayer;
    blurLayer.update(p5.width / sceneWidth);
    roomOverview.addObject(blurLayer);
    blackBackground.update(p5.width / sceneWidth);
    roomOverview.addObject(blackBackground);
    [blueHandsVideo, playerFrame, playbackIndicator, rewindButton, playButton, pauseButton, stopButton, fastforwardButton].forEach(obj => {
      obj.update(p5.width / sceneWidth);
      roomOverview.addObject(obj, true);
    });
    fridgeAudio.setVolume(0, audioFadeDuration);
  }

  /**
   * Closes video player.
   */
  function closeVideoPlayer() {
    blueHandsVideo.vid.elt.onseeked = null;
    blueHandsVideo.pause();
    [blackBackground, blurLayer, blueHandsVideo, playerFrame, playbackIndicator, rewindButton, playButton, pauseButton, stopButton, fastforwardButton].forEach(obj => {
      roomOverview.removeObject(obj);
    });
    fridgeAudio.setVolume(1, audioFadeDuration);
  }

  /**
   * Rewinds Blue Hands video.
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
   * Fast-forwards Blue Hands video.
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
   * Plays Blue Hands video.
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
   * Pauses Blue Hands video.
   */
  function pauseBlueHandsVideo() {
    playbackSpeed = 0;
    blueHandsVideo.pause();
  }

  /**
   * Stops Blue Hands video.
   */
  function stopBlueHandsVideo() {
    playbackSpeed = 0;
    blueHandsVideo.stop();
  }

  /**
   * Switches to e dog food close-up.
   */
  function switchToDogFoodCloseUp() {
    fridgeAudio.setVolume(0, audioFadeDuration);
    eatingAudio.loop();
    startScene(dogFoodCloseup);
  }

  /**
   * Returns from dog food close-up to room overview.
   */
  function returnFromDogFoodCloseup() {
    eatingAudio.stop();
    fridgeAudio.setVolume(1, audioFadeDuration);
    startScene(roomOverview);
  }

  /**
   * Switches to orange close-up.
   */
  function switchToOrangeCloseup() {
    fridgeAudio.setVolume(0, audioFadeDuration);
    larvaAudio.loop();
    startScene(orangeCloseup);
  }

  /**
   * Returns from orange close-up to room overview.
   */
  function returnFromOrangeCloseup() {
    larvaAudio.stop();
    fridgeAudio.setVolume(1, audioFadeDuration);
    startScene(roomOverview);
  }

  /**
   * Switches to portrait close-up.
   */
  function switchToPortraitCloseup() {
    fridgeAudio.setVolume(0);
    fridgeLowerAudio.loop();
    startScene(portraitCloseup);
  }

  /**
   * Return from portrait close-up to room overview. 
   */
  function returnFromPortraitCloseup() {
    fridgeLowerAudio.stop();
    fridgeAudio.setVolume(1);
    startScene(roomOverview);
  }

  /**
   * Draws playback indicator.
   * 
   * @param {p5} p5 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {number} playbackSpeed 
   */
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

  /**
   * Draws pause icon.
   * 
   * @param {p5} p5 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  function drawPauseIcon(p5, x, y, width, height) {
    p5.rect(x, y, width / 3, height);
    p5.rect(x + width * 2 / 3, y, width / 3, height);
  }

  /**
   * Draws fast-forward icon.
   * @param {p5} p5 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {number} count 
   */
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

  /**
   * Draws rewind icon.
   * @param {p5} p5 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {number} count 
   */
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
   * Calculates canvas size and position
   * Cnvas should be centered and fill as much of the window as possible
   * while maintaing the aspect ratio.
   * 
   * @returns canvas size and position.
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
   * Creates a pop-up image object
   * 
   * @param {string} path 
   * @param {number} imageToSceneHeightRatio
   * @returns the pop-up image object
   */
  function createPopupImage(path, imageToSceneHeightRatio) {
    const img = images.get(path);
    const scale = imageToSceneHeightRatio * sceneHeight / img.height;
    const x = (sceneWidth - scale * img.width) / 2;
    const y = (sceneHeight - scale * img.height) / 2;
    return new Image(img, x, y, scale);
  }

  /**
   * Creates a pop-up video object
   * 
   * @param {string} path 
   * @returns the pop-up video object
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
   * Inserts blur layer to room overview.
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
    fridgeAudio.setVolume(1);
  }

  /**
   * Shows a pop-up video and loops it.
   * 
   * @param {Video} video
   * @param {Function} onHide
   */
  function showPopupVideo(video, onHide) {
    fridgeAudio.setVolume(0, audioFadeDuration);
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
    fridgeAudio.setVolume(1, audioFadeDuration);
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
