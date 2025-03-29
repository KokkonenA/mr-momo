// Load assets. By doing this in the preload we can be sure that everything is loaded during the setup.
function preload() {
  backgroundImg = loadImage('assets/walls.png');
  cakeImg =  loadImage('assets/cake.png');
  cdPlayerImg = loadImage('assets/cd_player.png');
  cigarettesImg = loadImage('assets/cigarettes.png');
  dogFoodImg = loadImage('assets/dog_food.png');
  condomImg = loadImage('assets/used_condom.png');
  letterImg = loadImage('assets/letter.png');
  mrMomoImg = loadImage('assets/mr.momo.png');
  oldTvImg = loadImage('assets/old_tv.png');
  orangeImg = loadImage('assets/orange.png');
  pizzaBoxImg = loadImage('assets/pizza_box.png');
  rUOkImg = loadImage('assets/r_u_ok.png');
  rugImg = loadImage('assets/rug.png');
  tableImg = loadImage('assets/table.png');
  teaMugImg = loadImage('assets/tea_mug.png');
  portraitImg = loadImage('assets/portrait.png');
}

function setup() {
  
  // Calculate the canvas size and position based on dimensions of the background image.
  // The background image should fill the whole canvas.
  // The canvas should be centered and fill as much of the window as possible.
  windowImageWidthRelation = windowWidth / backgroundImg.width;
  windowImageHeightRelation = windowHeight / backgroundImg.height;

  if (windowImageWidthRelation < windowImageHeightRelation) {
    backgroundScale = windowImageWidthRelation;
    canvasX = 0;
    canvasY = (windowHeight - backgroundScale * backgroundImg.height) / 2;
  }
  else {
    backgroundScale = windowImageHeightRelation;
    canvasX = (windowWidth - backgroundScale * backgroundImg.width) / 2;
    canvasY = 0;
  }

  // Create the canvas and position it based on the calculations earlier.
  canvas = createCanvas(backgroundScale*backgroundImg.width, backgroundScale*backgroundImg.height);
  canvas.position(canvasX, canvasY);

  // Create a root object (the background) and add other scene objects as its children.
  // The images that should be on top should have a higher layer number.
  crimeScene = new SceneObject(backgroundImg, 0, 0, backgroundScale);
  crimeScene.addChild(cakeImg, 1500, 1100, 1, 0);
  crimeScene.addChild(rugImg, 2900, 1000, 1, 0);
  crimeScene.addChild(cigarettesImg, 3200, 1400, 1, 1);
  crimeScene.addChild(rUOkImg, 3380, 1600, 1, 1);
  crimeScene.addChild(dogFoodImg, 3200, 1600, 1, 2);
  crimeScene.addChild(condomImg, 3300, 2000, 1, 0);
  crimeScene.addChild(mrMomoImg, 1500, 1600, 1, 0);
  crimeScene.addChild(oldTvImg, 900, 500, 1, 0);
  crimeScene.addChild(orangeImg, 500, 1900, 1, 0);
  crimeScene.addChild(pizzaBoxImg, 3400, 700, 1, 1);
  crimeScene.addChild(letterImg, 2700, 1000, 1, 0);
  crimeScene.addChild(tableImg, 2200, 700, 1, 1);
  crimeScene.addChild(cdPlayerImg, 2300, 800, 1, 2);
  crimeScene.addChild(teaMugImg, 1800, 1000, 1, 0);
  crimeScene.addChild(portraitImg, 2900, 130, 1, 0);
}

function draw() {
  // Display the crime scene.
  crimeScene.display();
}
