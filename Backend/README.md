First, install dotnet 8.0.

Second, install packages:

dotnet add package Microsoft.EntityFrameworkCore \
dotnet add package Microsoft.EntityFrameworkCore.Design \
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

Third, create a psql database: it should have user inklubilet with password inklubilet, and be owner of database inklubilet:
```sql
create database inklubilet;
create user inklubilet with password 'inklubilet';
grant all privileges on database inklubilet to inklubilet;
\connect inklubilet
grant all on schema public to inklubilet;
```
It's required to add the following entries to `pg_hba.conf` (located `/var/lib/pgsql/data/pg_hba.conf` in Fedora, `/etc/postgresql/17/main/pg_hba.conf` in Debian) to have md5 verification for inklubilet user:
```
local   inklubilet      inklubilet                              md5
host    inklubilet      inklubilet      127.0.0.1/32            md5
```

Verify it is working by running: \
dotnet ef database update

dotnet run

Then open swagger by clicking URL that appears and going to {url}/swagger
