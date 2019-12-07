const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/dbmodel.js');
const sha256 = require('js-sha256');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//app.get('/api/pictures', sendPictures);
//app.post('/api/pictures', uploader.single('picfile'), uploadPicture);
//app.delete('/api/pictures/:id', deletePicture);
app.post('/api/create', createAcc);

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(8080);
console.log("Server listening on port 8080");

/* SERVER FUNCTIONS */

async function createAcc(req, res) {
  try{
    console.log("Account Create POST request");
    const hashedPwd = sha256(req.body.pwd);
    if(db.checkUsername(req.body.usr))
      await db.createAccount(req.body.usr, hashedPwd);
    else
      console.log("Account Already Exists!");
    res.status(200);
  }
  catch (e){
    error(res, e);
  }

  //try {
  //  await db.createAccount(req.query.title, req.query.order);
  //  res.status(200);
  //} catch (e) {
  //  error(res, e);
  //}
}

function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}
