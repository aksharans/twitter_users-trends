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

app.get('/test', (req, res) => {
    const test = require('./users');
    res.send(test);
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


app.use(express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));