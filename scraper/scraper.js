import { get } from "https";
import * as cheerio from "cheerio";
import {
  writeFile,
  mkdirSync,
  existsSync,
  writeFileSync,
  unlinkSync,
  readdirSync,
  readFileSync,
} from "fs";
import path from "path";
import * as fsPromises from "fs/promises";

async function checkContentExists(fileName) {
  const text = '<div class="ad-research-box card';
  console.log("Checking " + fileName);
  try {
    const contents = await fsPromises.readFile(fileName, "utf-8");
    return contents.includes(text);
  } catch (err) {
    console.error(err);
  }
  return false;
}

async function downloadPage(url, fileName) {
  console.log("Downloading " + fileName);

  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    },
  };

  // Wrap the request in a Promise to use async/await
  const data = await new Promise((resolve, reject) => {
    get(url, options, (response) => {
      if (response.statusCode === 403) {
        return reject(
          new Error("Error: 403 Forbidden. The server is blocking access."),
        );
      }

      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(data);
      });

      response.on("error", (err) => {
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });

  // Wait for the file to be written using async/await
  try {
    writeFileSync(fileName, data);
    console.log("Page downloaded successfully:", fileName);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

async function downloadCategory(url, baseDir, baseName) {
  let page = 1;
  let completeUrl = url + "&page=" + page;
  let filePath = baseDir + baseName + "_page_" + page + ".html";
  await downloadPage(completeUrl, filePath);
  while (await checkContentExists(filePath)) {
    console.log(
      "More content found in " + filePath + ", proceding to page " + page,
    );
    page++;
    completeUrl = url + "&page=" + page;
    filePath = baseDir + baseName + "_page_" + page + ".html";
    await downloadPage(completeUrl, filePath);
  }
  console.log(filePath + " doesn't have content, deleting...");
  unlinkSync(filePath);
}

function getCardUrls(urls) {
  for (const key in urls) {
    const dir = "data/" + key + "/";
    const fileList = readdirSync(dir);
    console.log(fileList);
    fileList.forEach((file, index) => {
      if (!file.includes(".html")) {
        return;
      }
      const fileContent = readFileSync(dir + file);
      const html = cheerio.loadBuffer(fileContent);
      const cards = [];
      html(".card-link").each((index, element) => {
        const url = html(element).attr("href");
        if (url) {
          cards.push("https://webbtelescope.org" + url);
        }
      });
      const json = JSON.stringify(cards, null, 2);
      writeFileSync(dir + key + "_cards.json", json);
    });
  }
}

async function downloadCardData(urls) {
  for (const key in urls) {
    const dir = "data/" + key + "/";
    const fileList = readdirSync(dir);
    fileList.forEach(async (file, index) => {
      if (!file.includes("_cards.json")) {
        return;
      }
      if (!existsSync(dir + "cards_html")) {
        mkdirSync(dir + "cards_html");
      }

      const fileContent = readFileSync(dir + file, { encoding: "utf8" });
      const cards = JSON.parse(fileContent);
      await cards.forEach(async (card, index) => {
        const filePath = dir + "cards_html/" + index + ".html";
        console.log(filePath);
        console.log(card);
        await downloadPage(card, filePath);
      });
    });
  }
}

function getCardData(urls) {
  for (const key in urls) {
    const dir = "data/" + key + "/cards_html/";
    const fileList = readdirSync(dir);
    const objects = [];
    fileList.forEach((file, index) => {
      if (!file.includes(".html")) {
        return;
      }
      const fileContent = readFileSync(dir + file);
      const $ = cheerio.loadBuffer(fileContent);

      const object = {};
      try {
        object["title"] = $("#page-title").text();

        object["release_date"] =
          $("#h3-release-date")[0].nextSibling.nodeValue.trim();
        object["img"] =
          "https://" +
          $("img.embedded-img.embedded-img__component.lazyloaded")
            .attr("src")
            .substring(2);
        console.log(object);
        objects.push(object);
      } catch (err) {
        console.error(err);
      }
    });
    writeFileSync(
      "data/" + key + "_objects.json",
      JSON.stringify(objects, null, 2),
    );
  }
}

async function main() {
  const urls = {
    cosmology:
      "https://webbtelescope.org/images?Category=02-cosmology&itemsPerPage=100",
    galaxies:
      "https://webbtelescope.org/images?Category=03-galaxies&itemsPerPage=100",
    nebulas:
      "https://webbtelescope.org/images?Category=04-nebulas&itemsPerPage=100",
    stars:
      "https://webbtelescope.org/images?Category=05-stars&itemsPerPage=100",
    exoplanets:
      "https://webbtelescope.org/images?Category=06-exoplanets&itemsPerPage=100",
    solar_system:
      "https://webbtelescope.org/images?Category=07-solar-system&itemsPerPage=100",
  };

  const dir = "data";
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  // for (const key in urls) {
  //   if (!existsSync("data/" + key)) {
  //     mkdirSync("data/" + key);
  //   }
  //   await downloadCategory(urls[key], "data/" + key + "/", key);
  // }
  // getCardUrls(urls);
  // await downloadCardData(urls);
  getCardData(urls);
}

main();
