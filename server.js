const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
hbs.registerPartials(__dirname+'/views/partials');

// Why to use app.set?
// Ans: So that we could use this way app.get('view engine')
// This will get us the hbs.
app.set('view engine','hbs');

hbs.registerHelper('getCurrentYear',() => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.use((req,res,next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log',log + '\n', (err) => {
        if(err){
            console.log('Unable to append the log');
        }
    });

    next();
});

app.use((req,res,next) => {
    // Without next() I can put my website in 
    // Maintenance mode.
    res.render('maintenance.hbs');
})

app.get('/', (req,res)=>{
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMsg: 'Welcome to my Website'
    });
});

app.get('/about', (req,res)=>{
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req,res)=> {
    res.send({
        'error': 'Unable to fetch data'
    });
});

app.listen(3000);