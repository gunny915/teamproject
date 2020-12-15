const getRandomElement = (arr) => {
  const size = arr.length;
  const randomIndex = Math.floor(Math.random() * size);
  return arr[randomIndex];
};

module.exports = {
  getRandomElement,
};
