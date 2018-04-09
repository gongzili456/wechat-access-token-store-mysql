const mysql = require('mysql2')

const defaultDbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'test',
  table: '_wechat_access_token_store_',
}

const pool = mysql.createPool(
  Object.assign(
    {
      poolLimit: 10,
    },
    opts,
  ),
)

module.exports = class MysqlStore {
  constructor(opts) {
    opts = opts || defaultDbConfig
    this.table = opts.table

    this.pool = pool
  }

  load(key) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.pool.getConnection(function(err, connection) {
        if (err) return reject(err)
        connection.execute(
          `SELECT * FROM \`${that.table}\` WHERE \`key\` = ?`,
          [key],
          function(err, rows, fields) {
            if (err) return reject(err)
            return resolve(rows[0] && rows[0].value)
          },
        )
      })
    })
  }
  save(key, value) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.pool.getConnection(function(err, connection) {
        if (err) return reject(err)
        connection.execute(
          `INSERT INTO \`${
            that.table
          }\` (\`key\`, \`value\`) VALUES(?, ?) ON DUPLICATE KEY UPDATE value = ?`,
          [key, value, value],
          function(err, rows, fields) {
            if (err) return reject(err)
            return resolve()
          },
        )
      })
    })
  }
  remove(key) {}
}
