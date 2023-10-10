const createLink = require("./create_link");

/* ----------------------------
          PARSE TREES SECTION
     ---------------------------- */

module.exports = async function parseTrees(navigationElementsArray, page) {
  try {
    const treesLink = createLink(
      navigationElementsArray[4].navigationElementHREF
    );
    await page.goto(treesLink);

    const treesNode = await page.$('div[style="padding-left:10px;"]');

    let treesArray = await page.evaluate((el) => {
      let arr = [];
      el.querySelectorAll("div.tree_name").forEach((el) =>
        arr.push({
          name: el.previousElementSibling.textContent,
          context: el.textContent,
          href: el.firstChild.getAttribute("href"),
        })
      );
      return arr;
    }, treesNode);

    for (let i = 0; i < treesArray.length; i++) {
      let treeImageLink = createLink(treesArray[i].href);
      await page.goto(treeImageLink);

      let treeImageLinkNodeHandle = await page.$(
        `iframe[src="${treesArray[i].href.slice(6).slice(0, -1)}"]`
      );
      let treeImageLinkFrame = await treeImageLinkNodeHandle.contentFrame();
      let treeImageLinkSrc = await treeImageLinkFrame.evaluate(() => {
        return document.querySelector("img").getAttribute("src");
      });

      treesArray[i].treeImageSrc = treeImageLinkSrc;
    }

    console.log("Trees has been parsed");
    return treesArray;
  } catch (error) {
    console.log(error.message);
  }
};
