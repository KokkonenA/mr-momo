import * as fs from "node:fs";
import * as path from "node:path"

// Get all image paths in the given directory and its subdirectories.
function getImagePaths(dir, imagesList) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      getImagePaths(fullPath, imagesList);
    } else if (path.extname(fullPath).toLowerCase() == ".png") {
      // Add image file to the map.
      imagesList.push(fullPath.replace(/\\/g, '/'));
    }
  });
}

const imagesList = [];
getImagePaths("assets", imagesList);
fs.writeFileSync("fileList.json", JSON.stringify(imagesList, null, 2));
