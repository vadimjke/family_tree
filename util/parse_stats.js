const createLink = require("./create_link");

/* ----------------------------
          PARSE STATS SECTION
     ---------------------------- */

module.exports = async function parseStats(navigationElementsArray, page) {
  try {
    const statsLink = createLink(
      navigationElementsArray[3].navigationElementHREF
    );
    await page.goto(statsLink);

    let statsArray = null;

    const statsNodes = await page.$$('table[width="650"] > tbody > tr');

    let summaryPersons = null;
    let summaryPersonsAlive = null;
    let summaryPersonsMen = null;
    let summaryPersonsWomen = null;
    let summaryLinksParentChildren = null;
    let summaryLinksHusbandWife = null;

    summaryPersons = await page.evaluate((el) => {
      let summaryPersonsName = el.children[0].textContent;
      let summaryPersonsValue = el.children[1].textContent;
      return { summaryPersonsName, summaryPersonsValue };
    }, statsNodes[0]);

    summaryPersonsAlive = await page.evaluate((el) => {
      let summaryPersonsAliveName = el.children[0].textContent;
      let summaryPersonsAliveValue = el.children[1].textContent;
      return { summaryPersonsAliveName, summaryPersonsAliveValue };
    }, statsNodes[1]);

    summaryPersonsMen = await page.evaluate((el) => {
      let summaryPersonsMenName = el.children[0].textContent;
      let summaryPersonsMenValue = el.children[1].textContent;
      return { summaryPersonsMenName, summaryPersonsMenValue };
    }, statsNodes[2]);

    summaryPersonsWomen = await page.evaluate((el) => {
      let summaryPersonsWomenName = el.children[0].textContent;
      let summaryPersonsWomenValue = el.children[1].textContent;
      return { summaryPersonsWomenName, summaryPersonsWomenValue };
    }, statsNodes[3]);

    summaryLinksParentChildren = await page.evaluate((el) => {
      let summaryLinksParentChildrenName = el.children[0].textContent;
      let summaryLinksParentChildrenValue = el.children[1].textContent;
      return {
        summaryLinksParentChildrenName,
        summaryLinksParentChildrenValue,
      };
    }, statsNodes[5]);

    summaryLinksHusbandWife = await page.evaluate((el) => {
      let summaryLinksHusbandWifeName = el.children[0].textContent;
      let summaryLinksHusbandWifeValue = el.children[1].textContent;
      return {
        summaryLinksHusbandWifeName,
        summaryLinksHusbandWifeValue,
      };
    }, statsNodes[6]);

    statsArray = {
      summaryPersons,
      summaryPersonsAlive,
      summaryPersonsMen,
      summaryPersonsWomen,
      summaryLinksParentChildren,
      summaryLinksHusbandWife,
    };

    console.log("Stats has been parsed");
    return statsArray;
  } catch (error) {
    console.log(error.message);
  }
};
