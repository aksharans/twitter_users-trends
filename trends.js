require('dotenv').config();

let Twitter = require('twitter');

let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });
client.get('trends/place', {id: 1}, function(error, tweets, response) {
    //console.log(tweets[0].trends);
    // let x = tweets[0];
    // console.log(JSON.parse(JSON.stringify(x)));
});





