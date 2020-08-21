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

    const express = require('express');
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


app.get('/fwsing', (req, res) => {
    const users = require('./followersing');

    setTimeout(function(){
        let following = users.twit_following;
        let followers = users.twit_followers;
        let mutual = following.filter(el => followers.includes(el));
        let nonmutual = following.filter(el => !followers.includes(el));

        res.render('followersing', {following : users.twit_following, followers: users.twit_followers,
        mutuals : mutual, nonmutuals : nonmutual });
    }, 400);
});


app.use(express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));