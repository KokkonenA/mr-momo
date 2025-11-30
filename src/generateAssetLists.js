import * as fs from "node:fs";
import * as path from "node:path"

// Get all asset paths in the given directory and its subdirectories.
function getAssetPaths(dir, imageList, soundList) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      getAssetPaths(fullPath, imageList, soundList);
    } else {
      const extension = path.extname(fullPath).toLowerCase();

      if (extension == ".png") {
        // Add image file to the image list.
        imageList.push(fullPath.replace(/\\/g, '/'));
      } else if (extension == ".wav") {
        // Add sound file to the sound list.
        soundList.push(fullPath.replace(/\\/g, '/'));
      }
    }
  });
}

const imageList = [];
const soundList = [];

getAssetPaths("assets", imageList, soundList);
fs.writeFileSync("imageList.json", JSON.stringify(imageList, null, 2));
fs.writeFileSync("soundList.json", JSON.stringify(soundList, null, 2));
