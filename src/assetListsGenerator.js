"use strict";

import * as fs from "fs";
import * as path from "path"

/**
 * Get all asset paths in the given directory and its subdirectories.
 * @param {string} dir 
 * @param {object} assetLists 
 */
function getAssetPaths(dir, assetLists) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAssetPaths(fullPath, assetLists);
    } else {
      const extension = path.extname(fullPath).toLowerCase();

      if (extension == ".webp") {
        assetLists.images.push(fullPath.replace(/\\/g, "/").replace(/^src\//, ""));
      } else if (extension == ".mp4") {
        assetLists.videos.push(fullPath.replace(/\\/g, "/").replace(/^src\//, ""));
      } else if (extension == ".m4a") {
        assetLists.sounds.push(fullPath.replace(/\\/g, "/").replace(/^src\//, ""));
      }
    }
  });
}

const assetLists = {
  images: [],
  videos: [],
  sounds: []
};

getAssetPaths("src\\assets", assetLists);

fs.writeFileSync("src\\assetLists.json", JSON.stringify(assetLists, null, 2));
