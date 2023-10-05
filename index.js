const getNavigationMenuElements = require("./util/get_navigation_menu_elements");
const createLink = require("./util/create_link");

const parsePersonList = require("./util/parse_person_list");
const parseGroups = require("./util/parse_groups");
const parseStats = require("./util/parse_stats");
const parseTrees = require("./util/parse_trees");
const parsePhotoalbums = require("./util/parse_photoalbums");

const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
const port = 3000;

app.get("/script.js", (req, res) => {
  (async function main() {
    console.log("Starting script");
    let parsedData = await getData();
    console.log("End of script");
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

  const personsListArray = await parsePersonList(navigationElementsArray, page);
  const groupArray = await parseGroups(navigationElementsArray, page);
  const statsArray = await parseStats(navigationElementsArray, page);
  const treesArray = await parseTrees(navigationElementsArray, page);
  const photoalbumsArray = await parsePhotoalbums(
    navigationElementsArray,
    page
  );

  /* --------------------------
          CREATE JSON SECTION
     -------------------------- */

  const personsListObj = Object.assign({}, personsListArray);
  const groupObj = Object.assign({}, groupArray);
  const statsObj = Object.assign({}, statsArray);
  const treesObj = Object.assign({}, treesArray);
  const photoalbumsObj = Object.assign({}, photoalbumsArray);

  const finalObj = {
    personsListObj,
    groupObj,
    statsObj,
    treesObj,
    photoalbumsObj,
  };

  await browser.close();

  return finalObj;
}
