const createLink = require("./create_link");

/* ----------------------------
          PARSE PERSONS SECTION
     ---------------------------- */

module.exports = async function parsePersonList(navigationElementsArray, page) {
  // Parse persons list page
  const personsListLink = createLink(
    navigationElementsArray[1].navigationElementHREF
  );
  await page.goto(personsListLink);

  const personsListNodeList = await page.$$(
    " div.persons_list_standard_sort.show_block > .person > a"
  );
  const personsListArray = [];

  for (const node of personsListNodeList) {
    let personName = null;
    let personHREF = null;
    let personBorn = null;
    let personDied = null;

    personName = await page.evaluate((el) => {
      if (el.firstChild) {
        return el.firstChild.textContent;
      }
      return null;
    }, node);

    personHREF = await page.evaluate((el) => el.getAttribute("href"), node);

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

    personsListArray.push({
      personName,
      personHREF,
      personBorn,
      personDied,
      personProfile: {},
    });
  }

  // Parse each person page
  for (let i = 0; i < personsListArray.length; i++) {
    const personLink = createLink(personsListArray[i].personHREF);
    await page.goto(personLink);

    let personName = null;
    let personBorn = null;
    let personDied = null;
    let personImageSrc = null;
    let personProfession = null;
    let personEducation = null;
    let personMilitary = null;
    let personAwards = [];
    let personFamilyTies = null;
    let personPhotoAlbum = [];
    let personBiography = null;

    const personPersonalPage = await page.$("table.b-table > tbody");

    personName = await page.evaluate(
      (el) => el.querySelector(".personFIO").textContent,
      personPersonalPage
    );

    personBorn = await page.evaluate(
      (el) => el.querySelector(".data_mesto_r").textContent,
      personPersonalPage
    );

    personDied = await page.evaluate((el) => {
      if (el.querySelector(".data_mesto_s")) {
        return el.querySelector(".data_mesto_s").textContent;
      }
      return null;
    }, personPersonalPage);

    personImageSrc = await page.evaluate(
      (el) =>
        el
          .querySelector("td.body_txt > table > tbody > tr > td > center > img")
          .getAttribute("src"),
      personPersonalPage
    );
    personImageSrc = `${personsListArray[i].personHREF.slice(
      0,
      -7
    )}/${personImageSrc}`;

    const elementHandle = await page.$('iframe[src="about.htm"]');
    const frame = await elementHandle.contentFrame();
    personProfession = await frame.evaluate(() => {
      if (document.querySelector(".profession")) {
        return (
          document.querySelector(".profession").textContent +
          document.querySelector(".profession").nextSibling.textContent
        ).replace("\n", " ");
      }
      return null;
    });

    const personEducationHandle = await page.$(
      'div[style="font-family:Tahoma; font-size:14px; color: #828282; padding: 16px 26px; padding-bottom:20px; line-height:20px;"]'
    );

    if (personEducationHandle) {
      personEducation = await personEducationHandle.evaluate((el) => {
        return el.textContent;
      });
    }

    personMilitary = personEducation;

    const personAwardLink = `${createLink(personsListArray[i].personHREF).slice(
      0,
      -7
    )}/awards/i.html`;
    await page.goto(personAwardLink);

    const personAwardsNodes = await page.$$('td[width="169px"]');
    for (const node of personAwardsNodes) {
      let award = await page.evaluate((el) => {
        if (el.querySelector("a > img")) {
          return el.querySelector("a > img").getAttribute("src");
        }
        return null;
      }, node);

      if (award) {
        personAwards.push(award);
      }
    }

    await page.goto(`${personLink}#rel_popup_win`);

    const personFamilyTiesNodeHandle = await page.$('iframe[src="rel.htm"]');
    const personFamilyTiesFrame =
      await personFamilyTiesNodeHandle.contentFrame();
    let personFamilyTiesArray = await personFamilyTiesFrame.evaluate(() => {
      let arr = [];
      document
        .querySelectorAll("td.l_cont > div, td.r_cont > div")
        .forEach((el) =>
          arr.push({ context: el.textContent, className: el.className })
        );
      return arr;
    });

    let personFamilyTiesArrayLinked = [];

    for (let i = 0; i < personFamilyTiesArray.length; i++) {
      if (personFamilyTiesArray[i].className !== "rodstv") {
        continue;
      }

      let arr = [];
      arr.push(personFamilyTiesArray[i]);

      for (let j = i + 1; j < personFamilyTiesArray.length; j++) {
        if (personFamilyTiesArray[j].className === "person2") {
          arr.push(personFamilyTiesArray[j]);
        } else {
          break;
        }
      }

      personFamilyTiesArrayLinked.push(arr);
    }

    personFamilyTies = personFamilyTiesArrayLinked;

    const personPhotoAlbumLink = `${createLink(
      personsListArray[i].personHREF
    ).slice(0, -7)}/persalb/i.html`;
    await page.goto(personPhotoAlbumLink);

    const personPhotoAlbumNodes = await page.$$('td[width="169px"]');
    for (const node of personPhotoAlbumNodes) {
      let photo = await page.evaluate((el) => {
        if (el.querySelector("a > img")) {
          return el.querySelector("a > img").getAttribute("src");
        }
        return null;
      }, node);

      if (photo) {
        personPhotoAlbum.push(photo);
      }
    }

    await page.goto(personLink);

    const personBiographyNodeHandle = await page.$('iframe[src="bio.htm"]');
    const personBiographyFrame = await personBiographyNodeHandle.contentFrame();
    let personBiographyArray = await personBiographyFrame.evaluate(() => {
      let arr = [];
      document
        .querySelectorAll("span.rvts7")
        .forEach((el) => arr.push(el.textContent));
      return arr;
    });

    personBiography = personBiographyArray;

    personsListArray[i].personProfile = {
      personName,
      personBorn,
      personDied,
      personImageSrc,
      personProfession,
      personEducation,
      personMilitary,
      personAwards,
      personFamilyTies,
      personPhotoAlbum,
      personBiography,
    };
  }

  console.log("Person list has been parsed");
  return personsListArray;
};
