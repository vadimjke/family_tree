const createLink = require("./create_link");

/* -----------------------------------
          PARSE PHOTOALBUMS SECTION
     ----------------------------------- */

module.exports = async function parsePhotoalbums(
  navigationElementsArray,
  page
) {
  try {
    const photoalbumsLink = createLink(
      navigationElementsArray[5].navigationElementHREF
    );
    await page.goto(photoalbumsLink);

    const photoalbumsNode = await page.$('div[style="padding-left:10px;"]');

    let photoalbumsArray = await page.evaluate((el) => {
      let arr = [];
      el.querySelectorAll("div.album").forEach((el) => {
        let href = el.firstChild.getAttribute("href");
        let context = el.firstChild.textContent;
        let id = href.match(/\d+/)[0];
        let hint = el.lastChild.attributes[1].textContent.match(/'.*'/)[0];
        arr.push({
          context,
          href,
          id,
          hint,
        });
      });
      return arr;
    }, photoalbumsNode);

    for (let i = 0; i < photoalbumsArray.length; i++) {
      let photoalbumsLink = createLink(photoalbumsArray[i].href);
      await page.goto(photoalbumsLink);

      let photoalbumsImages = [];

      let photoalbumsNodes = await page.$$('td[width="169px"]');
      for (let node of photoalbumsNodes) {
        let photo = await page.evaluate((el) => {
          if (el.querySelector("a > img")) {
            return el.querySelector("a > img").getAttribute("src");
          }
          return null;
        }, node);

        if (photo) {
          photoalbumsImages.push(photo);
        }
      }

      photoalbumsArray[i].photoalbumsImages = photoalbumsImages;
    }

    console.log("Groups has been parsed");
    return photoalbumsArray;
  } catch (error) {
    console.log(error.message);
  }
};
