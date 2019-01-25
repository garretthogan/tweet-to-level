const emoji = require('node-emoji');
const math = require('mathjs');

// this will be based on the number of emojis that fit
// per line, per tweet
const MAX_COLUMNS = 14;
const MAX_ROWS = 10;

// create an emoji map like a tweet would look
// just for testing
const createEmojiWorld = emojiCount => {
  let map = '';

  for (let i = 0; i <= emojiCount; i++) {
    const item = emoji.random();
    map += item.emoji;
  }

  return map;
};

/**
 *
 * TODO: Figure out how to properly map from flat array to matrix:
 *
 * [0, 0, 0, 0]
 * [0, 0, 0, 0]
 * [0, 0, 0, 0]
 * [0, 0, 0, 0]
 *
 * To get last element in each row is (numRows * (currentRowIndex + 1)) - 1
 *
 * if currentRowIndex is 0
 * - (4 x (0 + 1)) - 1 = 3 = flatArray[3] === last element in the first row
 *
 * if currentRowIndex is 1
 * - (4 x (1 + 1)) - 1 = 7 = flatArray[7] === last element in the second row
 *
 * To get an arbitrary element you need the column offset which is:
 * ((numRows * (currentRowIndex + 1)) - 1) - columnOffsetIndex
 *
 * if we want to map the second element in the array to the appropriate spot:
 *
 * if currentRowIndex = 1 and currentColumnIndex = 1, that should correspond to flatArray[5]
 * (4 x (1 + 1)) - 1 = 7 this gives us the last element of that row
 * then just subtract the currentColumnIndex + 1 and you get 5.
 *
 * if currentRowIndex = 2 and currentColumnIndex = 2, that should correspond to flatArray[11]
 * (4 x (2 + 1)) - 1 = 11 here we get the last item of the row
 *
 */

const mapToMatrix = (tweet = createEmojiWorld(140)) => {
  emojis = emoji
    .unemojify(tweet)
    .split(':')
    .filter(emoji.hasEmoji)
    .map(name => emoji.emojify(`:${name}:`));

  const rows = Math.floor(emojis.length / MAX_ROWS);
  const mat = math.zeros(rows, MAX_COLUMNS);
  mat.map((a, b, c) => {
    const x = b[1];
    const y = b[0];
    mat.subset(math.index(y, x), {
      asset: emoji.unemojify(emojis[x * y]).split(':')[1],
      x,
      y
    });
  });

  return mat;
};

console.log(mapToMatrix());
module.exports = { getMap: mapToMatrix };
