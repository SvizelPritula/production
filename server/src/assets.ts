import * as path from "path";
import * as fs from "fs/promises";

function escapeXML(string: string): string {
  let result: string[] = [];

  for (let char of string) {
    switch (char) {
      case "&":
        result.push("&amp;");
        break;
      case "<":
        result.push("&lt;");
        break;
      case ">":
        result.push("&gt;");
        break;
      case '"':
        result.push("&quot;");
        break;
      case "'":
        result.push("&apos;");
        break;
      default:
        result.push(char);
    }
  }

  return result.join("");
}

function getFallbackImage(name: string) {
  let result = `<?xml version="1.0" encoding="UTF-8"?>`;
  result += `<svg version="1.1" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">`;
  result += `<text x="50" y="75" dominant-baseline="middle" text-anchor="middle">${escapeXML(
    name
  )}</text>`;
  result += `</svg>`;

  return result;
}

function createDataUrl(content: string, type: string): string {
  var encoded = Buffer.from(content, "utf-8").toString("base64");
  return `data:${type};base64,${encoded}`;
}

export class AssetStore {
  assets: Map<string, string>;

  constructor(assets: Map<string, string>) {
    this.assets = assets;
  }

  getImage(name: string): string {
    if (this.assets.has(name)) {
      return this.assets.get(name)!;
    } else {
      return createDataUrl(getFallbackImage(name), "image/svg+xml");
    }
  }
}

export async function loadAssets(): Promise<AssetStore> {
  const assetDirectory =
    process.env.ASSET_PATH ?? path.join(require.main!.path, "../assets");
  var files = await fs.readdir(assetDirectory);

  var fileEntries = files
    .map((file) => path.parse(file))
    .map((file) => ({
      name: file.name,
      type: file.ext,
      path: path.join(assetDirectory, file.dir, file.base),
    }));

  fileEntries = fileEntries.filter((file) => file.type === ".svg");

  var promises = fileEntries.map((file) =>
    fs.readFile(file.path, { encoding: "utf-8" })
  );
  var contents = await Promise.all(promises);

  var map: Map<string, string> = new Map();

  for (var i = 0; i < fileEntries.length; i++) {
    map.set(fileEntries[i].name, createDataUrl(contents[i], "image/svg+xml"));
  }

  return new AssetStore(map);
}
