const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 5000;

const trends = require('./trends');
const { type } = require('os');


app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {

    require('dotenv').config();

    let Twitter = require('twitter');

    let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
    });

    client.get('trends/place', {id: 1}, function(error, tweets, response) {
        let trends_object = JSON.parse(JSON.stringify(tweets[0].trends));
        
        let trends = []

        for (let key in Object.keys(trends_object)){
            //console.log(trends_object[key]);
            trends.push(trends_object[key])
        } 
        
        console.log(trends);
        res.render('index', {data: trends});
    });

});

app.use(express.static(path.join(__dirname, '/public')));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));