const express = require('express');
require('dotenv').config();

const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

function getFollowing(screenName, following = [], cur = -1, limit = 0) {
    return new Promise ((resolve, reject) => {
        client.get('/friends/list', {screen_name : screenName, cursor : cur, count: 200}, function (error, data, res){
            if (error){
                reject(err);
            } else {
                cur = data.next_cursor;
                let user_list = data.users
                user_list.forEach(function(item){
                    following.push(item.screen_name);
                });
                limit += 1;
                if (cur > 0 && limit < 5) {
                    return resolve(getFollowing(screenName, following, cur, limit));
                  } else {
                    return resolve([].concat(...following));
                  }
            }
        });
    });

}

const x = async function following () {
    let user = await getFollowing('DVWildcatPod');
    //module.exports = user;
    return user;
}

let following_list = [];
x().then(val => following_list.push(...val)).catch((err) => console.log(err));
module.exports.twit_following = following_list;


/* */

function getFollowers(screenName, followers = [], cur = -1, limit = 0) {
    return new Promise ((resolve, reject) => {
        client.get('/followers/list', {screen_name : screenName, cursor : cur, count: 200}, function (error, data, res){
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

const y = async function followers () {
    let user = await getFollowers('DVWildcatPod');
    //module.exports = user;
    return user;
}
let follower_list = [];
y().then(val => follower_list.push(...val)).catch((err) => console.log(err));
module.exports.twit_followers = follower_list;



