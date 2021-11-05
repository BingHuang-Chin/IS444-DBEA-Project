const mysql = require("mysql")

let connection = null

export default {
  init () {
    connection = mysql.createConnection({
      host: "locahost",
      user: "root",
      password: "root",
      database: "fastcash"
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
