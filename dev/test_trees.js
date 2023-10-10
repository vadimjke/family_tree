const getNavigationMenuElements = require("../util/get_navigation_menu_elements");
const createLink = require("../util/create_link");

const parseTrees = require("../util/parse_trees");

const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
const port = 4000;

app.get("/script.js", (req, res) => {
  (async function main() {
    console.log("Starting parsing");
    let parsedData = await getData();
    console.log("Ending parsing");

    res.json(parsedData);
    console.log("Response has been sended");
  })();
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});

async function getData() {
  /* --------------------------
          SETUP BROWSER SECTION
     -------------------------- */

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(createLink("/index.html"));

  /* --------------------------
          PARSE SECTION
     -------------------------- */

  const navigationElementsArray = await getNavigationMenuElements(page);

  const treesArray = await parseTrees(navigationElementsArray, page);

  /* --------------------------
          CREATE JSON SECTION
     -------------------------- */

  const treesObj = Object.assign({}, treesArray);

  const finalObj = {
    treesObj,
  };

  await browser.close();

  return finalObj;
}
