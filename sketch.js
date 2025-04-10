// Load assets. By doing this in the preload we can be sure that everything is loaded when the setup starts.
function preload() {
  backgroundImg = loadImage("assets/walls.png");
  cakeImg =  loadImage("assets/cake.png");
  cdPlayerImg = loadImage("assets/cd_player.png");
  cigarettesImg = loadImage("assets/cigarettes.png");
  dogFoodImg = loadImage("assets/dog_food.png");
  condomImg = loadImage("assets/used_condom.png");
  letterImg = loadImage("assets/letter.png");
  mrMomoImg = loadImage("assets/mr.momo.png");
  oldTvImg = loadImage("assets/old_tv.png");
  orangeImg = loadImage("assets/orange.png");
  pizzaBoxImg = loadImage("assets/pizza_box.png");
  rUOkImg = loadImage("assets/r_u_ok.png");
  rugImg = loadImage("assets/rug.png");
  tableImg = loadImage("assets/table.png");
  teaMugImg = loadImage("assets/tea_mug.png");
  portraitImg = loadImage("assets/portrait.png");
}

function setup() {
  // Calculate the canvas size and position based on dimensions of the background image.
  // The background image should fill the whole canvas.
  // The canvas should be centered and fill as much of the window as possible.
  const windowImageWidthRelation = windowWidth / backgroundImg.width;
  const windowImageHeightRelation = windowHeight / backgroundImg.height;

  if (windowImageWidthRelation < windowImageHeightRelation) {
    var backgroundScale = windowImageWidthRelation;
    var canvasX = 0;
    var canvasY = (windowHeight - backgroundScale * backgroundImg.height) / 2;
  }
  else {
    var backgroundScale = windowImageHeightRelation;
    var canvasX = (windowWidth - backgroundScale * backgroundImg.width) / 2;
    var canvasY = 0;
  }

  // Create the canvas and position it based on the calculations earlier.
  canvas = createCanvas(backgroundScale*backgroundImg.width, backgroundScale*backgroundImg.height);
  canvas.position(canvasX, canvasY);

  // Create a root object (the background) and add other scene objects as its children.
  // The images that should be on top should have a higher layer number.
  crimeScene = new SceneObject(backgroundImg, 0, 0, backgroundScale, () => console.log("background"));
  crimeScene.addChild(cakeImg, 1500, 1100, 1, 0, () => console.log("cake"));
  crimeScene.addChild(rugImg, 2900, 1000, 1, 0, () => console.log("rug"));
  crimeScene.addChild(cigarettesImg, 3200, 1400, 1, 1, () => console.log("cigarettes"));
  crimeScene.addChild(rUOkImg, 3380, 1600, 1, 1, () => console.log("rUOk"));
  crimeScene.addChild(dogFoodImg, 3200, 1600, 1, 2, () => console.log("dogFood"));
  crimeScene.addChild(condomImg, 3300, 2000, 1, 0, () => console.log("condom"));
  crimeScene.addChild(mrMomoImg, 1500, 1600, 1, 0, () => console.log("mrMomo"));
  crimeScene.addChild(oldTvImg, 900, 500, 1, 0, () => console.log("oldTv"));
  crimeScene.addChild(orangeImg, 500, 1900, 1, 0, () => console.log("orange"));
  crimeScene.addChild(pizzaBoxImg, 3400, 700, 1, 1, () => console.log("pizzaBox"));
  crimeScene.addChild(letterImg, 2700, 1000, 1, 0, () => console.log("letter"));
  crimeScene.addChild(tableImg, 2200, 700, 1, 1, () => console.log("table"));
  crimeScene.addChild(cdPlayerImg, 2300, 800, 1, 2, () => console.log("cdPlayer"));
  crimeScene.addChild(teaMugImg, 1800, 1000, 1, 0, () => console.log("teaMug"));
  crimeScene.addChild(portraitImg, 2900, 130, 1, 0, () => console.log("portrait"));
}

function draw() {
  crimeScene.display();
}

function mouseClicked() {
  crimeScene.mouseClicked();
}
