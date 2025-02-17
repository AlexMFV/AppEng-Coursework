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
  const query = "select File.id, File.file_name, File.contents, File.last_update from File inner join Acc_File on File.id = Acc_file.file_id where Acc_File.usr_id = $1;";
  const result = await sql.query(query, [userId]);

  if(result.rows.length < 1)
    return null;

  //If 0 rows then there are no files
  return result.rows.map((row) => {
    return {
      id: row.id,
      file_name: row.file_name,
      contents: row.contents,
      last_update: row.last_update
    };
  });
};

module.exports.getUserId = async (user_name) => {
  const query = "select id from Account where usr=$1";
  const result = await sql.query(query, [user_name]);

  if(result.rows.length < 1)
    return -1;
  else
    return result.rows[0].id;
};

module.exports.createFile = async (userId, filename) => {
  const query = "insert into File(file_name, last_update) values($1, now()) returning id";
  const query2 = "insert into Acc_File(usr_id, file_id) values($1, $2) returning id";

  const fileId = await sql.query(query, [filename]);

  if(fileId.rows.length > 0){
    const result = await sql.query(query2, [userId, fileId.rows[0].id]);

    if(result.rows.length > 0)
      return true;
    return false;
  }
  return false;
};

module.exports.updateFile = async (userId, fileId, content) => {
  //This query is necessary so that if the user changed the id in the global variable
  //of the file manually this checks if the changed id exists with the current account
  const verif = "select id from Acc_File where usr_id=$1 and file_id=$2";
  const query = "update File set contents=$1, last_update=now() where id=$2";

  const returned = await sql.query(verif, [userId, fileId]);

  if(returned.rows.length > 0){
    await sql.query(query, [content, fileId]);
    return true;
  }
  return false;
};

module.exports.deleteFile = async (userId, fileId) => {
  //Delete the file with the current fileId if the file exists in the user account
  const verif = "select id from Acc_File where usr_id=$1 and file_id=$2";
  const query = "delete from Acc_File where usr_id=$1 and file_id=$2";
  const query2 = "delete from File where id=$1";

  const returned = await sql.query(verif, [userId, fileId]);

  if(returned.rows.length > 0){
    try{
      await sql.query(query, [userId, fileId]);
      await sql.query(query2, [fileId]);
      return true;
    }
    catch(e){
      console.log(e.message);
    }
  }
  return false;
};

module.exports.renameFile = async (userId, fileId, file_name) => {
  //Update the name of the file with the corresponding fileId if the file exists in the user account
  const verif = "select id from Acc_File where usr_id=$1 and file_id=$2";
  const query = "update File set file_name=$1 where id=$2 returning file_name as name";

  const returned = await sql.query(verif, [userId, fileId]);

  if(returned.rows.length > 0){
    const newName = await sql.query(query, [file_name, fileId]);
    return newName.rows[0].name;
  }
  return false;
};
