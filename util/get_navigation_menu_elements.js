module.exports = async function getNavigationMenuElements(page) {
  // Parse navigation menu
  const navigationElementsNodeList = await page.$$(".menu > a");
  const navigationElementsArray = [];

  for (const node of navigationElementsNodeList) {
    let navigationElementName = null;
    let navigationElementHREF = null;

    navigationElementName = await page.evaluate((el) => el.textContent, node);
    navigationElementHREF = await page.evaluate(
      (el) => el.getAttribute("href"),
      node
    );

    navigationElementsArray.push({
      navigationElementName,
      navigationElementHREF,
    });
  }

  return navigationElementsArray;
};
