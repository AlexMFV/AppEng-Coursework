const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index');
  //res.sendFile(path.join(__dirname + '/index.html'));
  //res.send('Hello ' + (req.query.name || 'anonymous') + '!');
});
  
app.listen(8080);
console.log("Server listening on port 8080");