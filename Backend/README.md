First, install dotnet 8.0.

Second, install packages:

dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

Third, create a pqsql database: it should have user inklubilet with password inklubilet, and be owner of database inklubilet. It's required to change /var/lib/pgsql/data/pg_hba.conf to have md5 verification in each field.

Verify it is working by running:
dotnet ef migrations add InitialCreate
dotnet ef database update

dotnet run

Then open swagger by clicking URL that appears and going to {url}/swagger
Then try to use endpoints (should be two endpoints, Post and Get, with adding tasks and listing tasks). If database-update works then so should this, but you never know.