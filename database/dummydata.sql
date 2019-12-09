insert into Account(usr, pwd) values('Alex', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
insert into Account(usr, pwd) values('Carlitos', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
insert into Account(usr, pwd) values('Relix', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');

insert into File(file_name, contents, last_update) values('preset1', 'abc', now());
insert into File(file_name, contents, last_update) values('preset2', 'def', now());
insert into File(file_name, contents, last_update) values('preset3', 'hij', now());
insert into File(file_name, contents, last_update) values('preset4', 'klm', now());

insert into Acc_File(usr_id, file_id) values(3, 1);
insert into Acc_File(usr_id, file_id) values(1, 2);
insert into Acc_File(usr_id, file_id) values(2, 3);
insert into Acc_File(usr_id, file_id) values(1, 4);
