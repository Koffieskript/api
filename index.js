const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./connectDb');
const PORT = require('./utilities').PORT;
const incidents = require('./resources/incidents');
const incidentCategories = require('./resources/incidentCategories');
const cleaners = require('./resources/cleaners');
const battery = require('./resources/battery');

connectDb();

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/cleaners', cleaners);
app.use('/incidents', incidents);
app.use('/categories', incidentCategories);
app.use('/battery', battery);

app.listen(PORT, err => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`API now listening @ port ${PORT}`)
  }
});
