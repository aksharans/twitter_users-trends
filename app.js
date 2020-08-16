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
    res.render('index', {loc: twit.location, data: twit.trends});

    console.log(req.body);

});


app.post('/trends', (req,res) => {
    console.log(req.body);

    require('dotenv').config();


    let Twitter = require('twitter');

    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        bearer_token: process.env.TWITTER_BEARER_TOKEN
    });

    client.get('trends/place', {id: Number(req.body.name)}, function(error, tweets, response) {
        let trends = tweets[0].trends;
        let location = tweets[0].locations[0].name;
        res.render('trends', {loc: location, data: trends});
    });

    //res.redirect('/');
});






app.use(express.static(path.join(__dirname, '/public')));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));