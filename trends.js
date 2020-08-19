const express = require('express');
const location = 1;
require('dotenv').config();

const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

client.get('trends/place', {id: location}, function(error, tweets, response) {
    module.exports.trends = tweets[0].trends;
    module.exports.location = tweets[0].locations[0].name;
});






