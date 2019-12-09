const Postgres = require('pg').Client;
const config = require('../config.js');
const sql = new Postgres(config.pgsql);

sql.connect();
sql.on('error', (err) => {
  console.error(err);
  sql.end();
});

module.exports.createAccount = async (user, pwd) => {
  const query = "insert into Account(usr, pwd) values($1, $2)";
  const result = await sql.query(query, [user, pwd]);
};

module.exports.checkUsername = async (user) => {
  const query = "select * from Account where usr=$1";
  const result = await sql.query(query, [user]);

  if(result.rows.length < 1)
    return false;
  return true;
};

module.exports.checkAccount = async (user, pwd) => {
  const query = "select * from Account where usr=$1 and pwd=$2";
  const result = await sql.query(query, [user, pwd]);

  if(result.rows.length < 1)
    return false;
  return true;
};

module.exports.getFiles = async (userId) => {
  //Get all the files associated with the current UserId
  const query = "select * from File inner join Acc_File on Acc_File";

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
