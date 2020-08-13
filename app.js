const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 5000;


app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
    res.render('index');
});

app.use(express.static(path.join(__dirname, '/public')));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));