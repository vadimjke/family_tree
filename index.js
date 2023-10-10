const getNavigationMenuElements = require("./util/get_navigation_menu_elements");
const createLink = require("./util/create_link");
const testData = require("./test/test_data");

const parsePersonList = require("./util/parse_person_list");
const parseGroups = require("./util/parse_groups");
const parseStats = require("./util/parse_stats");
const parseTrees = require("./util/parse_trees");
const parsePhotoalbums = require("./util/parse_photoalbums");

const puppeteer = require("puppeteer");
const express = require("express");
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

app.get("/script.js", (req, res) => {
    (async function main() {
        console.log("Starting parsing");
        let parsedData = await getData();
        console.log("Ending parsing");

        if (!testData(parsedData)) {
            res.send("Object has missing properties");
        } else {
            console.log("Data has been tested");

            res.json(parsedData);
            console.log("Response has been sended");
        }
    })();
});
app.get('/download', function(req, res) {
    const file = `data.json`;
    res.download(file);
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
        args: ['--no-sandbox']
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

    // return finalObj;
    fs.writeFile("data.json", finalObj, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
}