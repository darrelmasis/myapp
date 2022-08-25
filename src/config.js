module.exports = {
  mysql_database: {
    remote: {
      connectionLimit: 1000,
      host: 'us-cdbr-east-04.cleardb.com',
      user: 'b574b9c8ca56c8',
      password: 'f962c8c8',
      database: 'heroku_56689a12f8a9ca9',
      connectTimeout: 30000 //10000 default
    },
    local: {
      host: 'localhost',
      user: 'root',
      password: 'MySQL-dM@sis1996',
      database: 'mydb',
      port: 3306
    }
  }
}
