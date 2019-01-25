'use strict';

const crypto = require('crypto');
const { getMap } = require('./tweet-conversion');

module.exports.tweet = async (event, context) => {
  const body = JSON.parse(event.body);
  console.log('EVENT ', event);
  if (event.httpMethod === 'GET') {
    const crc_token = event.queryStringParameters.crc_token;
    const response = crypto
      .createHmac('sha256', process.env.CONSUMER_SECRET_KEY)
      .update(crc_token)
      .digest('base64');

    const body = JSON.stringify({ response_token: `sha256=${response}` });
    return {
      statusCode: 200,
      body
    };
  } else if (body.tweet_create_events && body.tweet_create_events.length > 0) {
    const tweet = body.tweet_create_events[0];

    if (tweet.in_reply_to_screen_name === process.env.USERNAME) {
      const map = getMap(tweet.text);

      return { successful: true, map, message: 'Map successfully created!' };
    } else {
      console.log(`NO TWEET CREATED `, body);

      return {
        successful: false,
        message: `Only tweets replying to ${
          process.env.USERNAME
        } are converted to maps!`
      };
    }
  }

  console.log(`COULDN'T CREATE MAP `, body);
  return {
    successful: false,
    message: 'This was not a created tweet event!'
  };
};
