module.exports = function testData(data) {
  let hasKey = true;
  let mustHaveKeysArr = [
    "personsListObj",
    "groupObj",
    "statsObj",
    "treesObj",
    "photoalbumsObj",
  ];

  mustHaveKeysArr.forEach((el) => {
    if (!Object.keys(data).includes(el)) {
      hasKey = false;
    }
  });

  return hasKey;
};
