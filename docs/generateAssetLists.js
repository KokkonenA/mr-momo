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
        imageList.push(fullPath.replace(/\\/g, '/').replace(/^docs\//, ''));
      } else if (extension == ".wav") {
        // Add sound file to the sound list.
        soundList.push(fullPath.replace(/\\/g, '/').replace(/^docs\//, ''));
      } else if (extension == ".mp4") {
        // Add video file to the video list.
        videoList.push(fullPath.replace(/\\/g, '/').replace(/^docs\//, ''));
      }
    }
  });
}

const imageList = [];
const soundList = [];
const videoList = [];

getAssetPaths("docs\\assets", imageList, soundList);
fs.writeFileSync("docs\\imageList.json", JSON.stringify(imageList, null, 2));
fs.writeFileSync("docs\\soundList.json", JSON.stringify(soundList, null, 2));
fs.writeFileSync("docs\\videoList.json", JSON.stringify(videoList, null, 2));
