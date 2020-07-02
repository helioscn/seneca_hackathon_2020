const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const getlocation = require('./routes/getlocation');

// setup view engine
app.engine('hbs', hbs({ 
    extname: 'hbs', 
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// port
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
app.listen(PORT);

// look for routes
app.use("/api/getlocation", getlocation);

app.get("/", (req, res) => {
    res.render('index', {
        title: "Home"
    });
});

app.get("/postings", (req, res) => {
    res.render('postings', {
        title: "Postings"
    });
});