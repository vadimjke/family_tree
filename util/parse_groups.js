const createLink = require("./create_link");

/* ----------------------------
          PARSE GROUPS SECTION
     ---------------------------- */

module.exports = async function parseGroups(navigationElementsArray, page) {
  // Parse groups page
  try {
    const groupsLink = createLink(
      navigationElementsArray[2].navigationElementHREF
    );
    await page.goto(groupsLink);

    const groupNodeList = await page.$$(".person > a");
    const groupArray = [];

    for (const node of groupNodeList) {
      let groupName = null;
      let groupHREF = null;

      groupName = await page.evaluate((el) => {
        if (el.firstChild) {
          return el.firstChild.textContent;
        }
        return null;
      }, node);

      groupHREF = await page.evaluate((el) => el.getAttribute("href"), node);

      if (groupHREF === "list.html") {
        continue;
      }
      groupArray.push({
        groupName,
        groupHREF,
      });
    }

    // Parse each group page
    for (let i = 0; i < groupArray.length; i++) {
      const groupLink = createLink(groupArray[i].groupHREF);
      await page.goto(groupLink);

      const groupNodeList = await page.$$(
        " div.persons_list_standard_sort.show_block > .person > a"
      );

      let personArr = [];

      for (let node of groupNodeList) {
        let personName = null;
        let personHREF = null;
        let personID = null;
        let personBorn = null;
        let personDied = null;

        personName = await page.evaluate((el) => {
          if (el.firstChild) {
            return el.firstChild.textContent;
          }
          return null;
        }, node);

        personHREF = await page.evaluate((el) => el.getAttribute("href"), node);

        personID = personHREF.match(/\d+/)[0];

        personBorn = await page.evaluate((el) => {
          let personSpanChildNodes = el.querySelector("span").childNodes;
          return (
            personSpanChildNodes[0].textContent +
            personSpanChildNodes[1].textContent
          ).trim();
        }, node);

        personDied = await page.evaluate((el) => {
          let personSpanChildNodes = el.querySelector("span").childNodes;
          if (personSpanChildNodes[2]) {
            return (
              personSpanChildNodes[2].textContent +
              personSpanChildNodes[3].textContent
            ).trim();
          }
          return null;
        }, node);

        personArr.push({
          personName,
          personHREF,
          personID,
          personBorn,
          personDied,
        });
      }

      groupArray[i].groupPersons = personArr;
    }

    console.log("Groups has been parsed");
    return groupArray;
  } catch (error) {
    console.log(error.message);
  }
};
