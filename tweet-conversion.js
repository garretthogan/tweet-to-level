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
