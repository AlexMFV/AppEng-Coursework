create table if not exists Account (
  id serial primary key,
  usr varchar(30),
  pwd varchar(100)
);

create table if not exists File (
  id serial primary key,
  file_name varchar(100),
  last_update date
);

create table if not exists Acc_File (
  id serial primary key,
  usr_id integer,
  file_id integer
);

--ENCRYPT PASSWORDS WITH SHA256
--USE https://www.npmjs.com/package/js-sha256
