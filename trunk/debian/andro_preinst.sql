create role root nologin;
create user start superuser password 'start';
grant root to start;
create database andro;
create language plperlu;
create language plperl;

