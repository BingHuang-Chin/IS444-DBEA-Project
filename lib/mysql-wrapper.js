const mysql = require("mysql2")

let connection = null

module.exports = {
  init () {
    connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "fastcash",
      insecureAuth: true
    })

    connection.connect(err => {
      if (err) throw err
      console.log("Connected to MySQL server!")
    })
  },

  getConnection () {
    if (!connection)
      this.init()

    return connection
  }
}
