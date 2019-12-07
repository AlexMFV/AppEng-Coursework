const Postgres = require('pg').Client;
const config = require('../config.js');
const sql = new Postgres(config.pgsql);

sql.connect();
sql.on('error', (err) => {
  console.error(err);
  sql.end();
});

module.exports.createAccount = async (user, pwd) => {
  //Insert into the database, user and hashed password
  //const query = "insert into Account values($1, $2)";
  //const result = await sql.query(query, [user, pwd]);

  //console.log(result);

  console.log("Created User!");
};

module.exports.checkUsername = async (user) => {
  const query = "select count(id) from Account where usr=$1";
  const result = await sql.query(query, [user]);

  console.log(result.rows.count);

  if(result.rows.count === '0')
    return false;
  return true;
};

module.exports.checkAccount = async (user, password) => {
  //Hash the password
  //If the username exists check if the hash password corresponds to the one on the database
  console.log("Check Account!");
};

module.exports.getFiles = async (userId) => {
  //Get all the files associated with the current UserId
  console.log("Got Files!");
};

module.exports.deleteFile = async (fileId) => {
  //Delete the file with the current fileId
  console.log("Deleted File!");
};

module.exports.uploadFile = async (reqFile, title) => {
  //Add the file to the database
  //Assign the file to the user
  console.log("Uploaded File!");
};

module.exports.saveFile = async (fileId, newContent) => {
  //Alter the content of the file with the corresponding fileId
  console.log("Saved File!");
};
