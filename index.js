const mysql = require('mysql2')

const defaultDbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'test',
  table: '_wechat_access_token_store_',
}

module.exports = class MysqlStore {
  constructor(opts) {
    console.log('opts: ', opts)
    opts = opts || defaultDbConfig
    this.table = opts.table

    this.connection = mysql.createConnection(opts)
  }

  load(key) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.connection.execute(
        `SELECT * FROM \`${that.table}\` WHERE \`key\` = ?`,
        [key],
        function(err, rows, fields) {
          if (err) return reject(err)
          return resolve(rows[0] && rows[0].value)
        },
      )
    })
  }
  save(key, value) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.connection.execute(
        `INSERT INTO ${
          that.table
        }(key, value) VALUES(?, ?) ON DUPLICATE KEY UPDATE key = ?`,
        [key, value, key],
        function(err, rows, fields) {
          if (err) return reject(err)
          return resolve()
        },
      )
    })
  }
  remove(key) {}
}
