const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var providers = require('./public/js/providers').providers;
var helpers = require('handlebars-helpers');
var math = helpers.math();
var array = helpers.array();

// setup view engine
app.engine('hbs', hbs({ 
    extname: 'hbs', 
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
}));
app.set('views', path.join(__dirname, 'views'));            // all views inside views
app.set('view engine', 'hbs');                              
app.use(express.static(path.join(__dirname, 'public')));    // css, js, assets inside ./public

// setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// port
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
app.listen(PORT);

// look for routes
app.use("/api/getlocation", require('./routes/getlocation'));
app.use("/api/getdistance", require('./routes/getdistance'));

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

app.get("/providers", (req, res) =>{
    res.render('providers',{
        title: "Service Providers",
        providersData: providers
    });
});