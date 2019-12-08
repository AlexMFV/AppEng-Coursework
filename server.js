const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/dbmodel.js');
const sha256 = require('js-sha256');
const session = require('express-session');

//Variables
const SESSION_AGE = 1000 * 60 * 60 * 24; //24 Hours expiration date
const SESSION_NAME = 'sID';
const SESSION_SECRET = '@up902282!-\'wio\'';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: SESSION_AGE,
    sameSite: true,
    secure: false //Change to true later
  }
}));

const redirectIndex = (req, res, next) => {
  console.log("Session Login: " + req.session.userId);
  if(!req.session.userId)
    res.redirect('/login');
  else
    next();
}

const updateQueryString = (req, res, next) => {
  console.log("Session Index: " + req.session.userId);
  console.log("User: \""+ req.query.user + "\"");
  if(req.session.userId && req.query.user !== req.session.userId)
    res.redirect('/index?usr=' + req.session.userId);
}

//app.get('/api/pictures', sendPictures);
//app.post('/api/pictures', uploader.single('picfile'), uploadPicture);
//app.delete('/api/pictures/:id', deletePicture);
app.get('/login', redirectIndex);
app.get('/', updateQueryString);
app.get('/index', updateQueryString);

app.post('/api/create', createAcc);
app.post('/api/login', loginAcc);

app.get('/', function (req, res) {
  const userID = req.session;
    res.render('index');
});

app.listen(8080);
console.log("Server listening on port 8080");

/* SERVER FUNCTIONS */

async function createAcc(req, res) {
  try{
    const hashedPwd = sha256(req.body.pwd);
    const exists = await db.checkUsername(req.body.usr);

    if(!exists)
      await db.createAccount(req.body.usr, hashedPwd);

    req.session.userId = req.body.usr;
    console.log("Login Success: " + req.session.userId);
    res.json(exists);
  }
  catch (e){
    error(res, e);
  }
}

async function loginAcc(req, res){
  try{
    const hashedPwd = sha256(req.body.pwd);
    const exists = await db.checkAccount(req.body.usr, hashedPwd);

    req.session.userId = req.body.usr;
    console.log("Account Created: " + req.session.userId);
    res.json(exists);
  }
  catch(e){
    error(res, e)
  }
}

function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}
