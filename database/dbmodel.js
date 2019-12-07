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
  console.log(user);
  console.log(pwd);
  console.log("Created User!");
};

module.exports.checkUsername = async (user) => {
  //Check if the username exists
  const query = "select count(id) from Account where usr = '" + user + "';";

  // now query the table and output the results
  const result = await sql.query(query, param);

  console.log(result);

  return false;
  //return result.rows.map((row) => {
  //  return {
  //    id: row.id,
  //  };
  //});

  console.log("Check User!");
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
