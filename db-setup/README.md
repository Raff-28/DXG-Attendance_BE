# Database setup (local)

Install the latest version of MySQL: https://www.mysql.com/downloads/

Ensure MySQL is running:

```sh
sudo systemctl start mysql  # For Linux (if applicable)
```

Then run it using root or your preferred user:

```
mysql -u root -p
```

Create the db

```sql
CREATE DATABASE hr_module_db;
USE hr_module_db;
```

Run the table creation scripts at [create-tables-ddl.sql](create-tables-ddl.sql)

```sh
mysql -u root -p hr_module_db < create-tables-ddl.sql
```

After that the database is ready for use.
