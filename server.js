const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/dbmodel.js');
const sha256 = require('js-sha256');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(session({
  name: "sId",
  resave: false,
  saveUninitialized: false,
  secret: "@up902282!\"-wio\"",
  cookie: {
    maxAge: 1000*60*60*24,
    sameSite: true,
    secure: false //Set to true later
  }
}));

app.get('/api/user', checkUserLogin);
app.post('/api/create', createAcc);
app.post('/api/login', loginAcc);
app.get('/api/userfiles', getFilesByUserId);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  res.json(JSON.stringify(req.session.userId));
});

app.listen(8080);
console.log("Server listening on port 8080");

/* SERVER FUNCTIONS */

async function createAcc(req, res) {
  try{
    const hashedPwd = sha256(req.body.pwd);
    const exists = await db.checkUsername(req.body.usr);

    if(!exists){
      await db.createAccount(req.body.usr, hashedPwd);
      req.session.userId = req.body.usr;
    }

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

    if(exists)
      req.session.userId = req.body.usr;

    res.json(exists);
  }
  catch(e){
    error(res, e);
  }
}

function checkUserLogin(req, res){
  try{
    const value = (req.session.userId !== undefined ? true : false);
    res.json(value);
    return JSON.stringify(value);
  }
  catch(e){
    error(res, e);
  }
}

async function getFilesByUserId(req, res){
  try{
    const uId = await getUserId(req, res);
    const files = await db.getFiles(uId);

    if(files !== undefined)
        req.session.userData = files;
    else
        req.sessions.userData = -1;

    res.json(files);
  }
  catch(e){
    error(res, e);
  }
}

async function getUserId(req, res){
  try{
    const uId = await db.getUserId(req.session.userId);
    return uId;
  }
  catch(e){
    error(res, e);
  }
}

function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}
