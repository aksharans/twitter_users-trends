const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 5000;


app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false}));


app.get('/', (req, res) => {

    const twit = require('./trends');
    setTimeout(function(){
        res.render('index', {loc: twit.location, data: twit.trends});
    }, 400);

});

app.post('/trends', (req,res) => {

    require('dotenv').config();

    const Twitter = require('twitter');

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        bearer_token: process.env.TWITTER_BEARER_TOKEN
    });

    const locations_list = require('./trends_locations');
    const result = locations_list.find(obj => {
        return obj.name == req.body.name || obj.woeid == req.body.name;
    });
    if (typeof result === 'undefined') {
        res.redirect('/');
    } else {

        const woeid = result.woeid;
        client.get('trends/place', {id: Number(woeid)}, function(error, tweets, response) {  
            if (error) {
                res.redirect('/');
            }  else {
                let trends = tweets[0].trends;
                let location = tweets[0].locations[0].name;
                res.render('trends', {loc: location, data: trends});
            }
            
        });
    }
  
});


app.post('/lookup', (req, res) => {
    const input = req.body.name1;

    require('dotenv').config();

    const Twitter = require('twitter');

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        bearer_token: process.env.TWITTER_BEARER_TOKEN
    });

    client.get('users/lookup', {screen_name : input}, function(error, data, response) {
        
        if (error) {
            res.redirect('/');
        } else {
        
            const user = data[0];

            const user_data = {};
            user_data['username'] = user.name;
            user_data['handle'] = user.screen_name;
            user_data['location'] = user.location || "n/a";
            user_data['description'] = user.description || "n/a";
            user_data['link'] = user.url || "#";
            user_data['followers'] = user.followers_count;
            user_data['following'] = user.friends_count;
            user_data['likes'] = user.favourites_count;
            user_data['tweets'] = user.statuses_count;
            user_data['verified'] = user.verified ? "Verified" : "Not Verified";
            user_data['img'] = user.profile_image_url_https;
            user_data['banner'] = user.profile_banner_url;
    
            res.render('lookup', user_data);
        }

    });
});


app.post('/fwsing', (req, res) => {

    const input = req.body.name2;

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
        let user = await getFollowing(input);
        return user;
    }
    let following_list = [];
    x().then(val => following_list.push(...val)).catch((err) => following_list("error"));


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
        let user = await getFollowers(input);
        return user;
    }
    let follower_list = [];
    y().then(val => follower_list.push(...val)).catch((err) => follower_list.push("error"));   


    setTimeout(function(){
        let mutual = following_list.filter(el => follower_list.includes(el));
        let nonmutual = following_list.filter(el => !follower_list.includes(el));
        res.render('followersing', {at : input, mutuals : mutual, nonmutuals : nonmutual});
    }, 1200);
    

});


app.get('/about', (req, res)=> {
    res.render('about');
});





app.use(express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));