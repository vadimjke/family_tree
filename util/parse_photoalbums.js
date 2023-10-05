const createLink = require("./create_link");

/* -----------------------------------
          PARSE PHOTOALBUMS SECTION
     ----------------------------------- */

module.exports = async function parsePhotoalbums(
  navigationElementsArray,
  page
) {
  const photoalbumsLink = createLink(
    navigationElementsArray[5].navigationElementHREF
  );
  await page.goto(photoalbumsLink);

  const photoalbumsNode = await page.$('div[style="padding-left:10px;"]');

  let photoalbumsArray = await page.evaluate((el) => {
    let arr = [];
    el.querySelectorAll("div.album").forEach((el) =>
      arr.push({
        context: el.firstChild.textContent,
        href: el.firstChild.getAttribute("href"),
      })
    );
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

  console.log("Photoalbums has been parsed");
  return photoalbumsArray;
};
