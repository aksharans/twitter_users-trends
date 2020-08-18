const express = require('express');
require('dotenv').config();

const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

let followers = new Set();

client.get('friends/list', {screen_name: 'BFTB_Chargers'},  function getData(err, data, response) {

    //console.log(data.users);
    let x = data.users;
    x.forEach(function(item){
        followers.add(item.screen_name)
    });
  
    // if(data['next_cursor'] > 0) {
    //     client.get('friends/list', { screen_name: 'BFTB_Chargers', cursor: data['next_cursor'] }, getData);
    // } 
  
    //console.log(followers);

});
  
module.exports = followers;


