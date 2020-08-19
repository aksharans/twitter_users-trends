const express = require('express');
require('dotenv').config();

const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

function getFollowers(screenName, followers = [], cur = -1, limit = 0) {
    return new Promise ((resolve, reject) => {
        client.get('/friends/list', {screen_name : screenName, cursor : cur, count: 200}, function (error, data, res){
            if (error){
                reject(err);
            } else {
                cur = data.next_cursor;
                let user_list = data.users
                user_list.forEach(function(item){
                    followers.push(item.screen_name);
                });
                limit += 1;
                if (cur > 0 && limit < 5) {
                    return resolve(getFollowers(screenName, followers, cur, limit));
                  } else {
                    return resolve([].concat(...followers));
                  }
            }
        });
    });

}


const x = async function getUser () {
    let user = await getFollowers('BFTB_Chargers');
    //module.exports = user;
    return user;
}


let a = [];
x().then(val => a.push(...val)).catch((err) => console.log(err));
console.log(a);
module.exports = a;

