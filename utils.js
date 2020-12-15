const getRandomElement = (arr) => {
  const size = arr.length;
  const randomIndex = Math.floor(Math.random() * size);
  return arr[randomIndex];
};
const getLevelEXP = (level) => {
  return 20 + (Math.max(parseInt(level) - 1, 0) * 10);
};
module.exports = {
  getRandomElement,
  getLevelEXP,
};
