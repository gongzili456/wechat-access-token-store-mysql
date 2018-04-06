const Store = require('./index')

const store = new Store({
  host: 'bj-cdb-jyxs5jtv.sql.tencentcdb.com',
  port: 63570,
  user: 'root',
  password: 'tongxing2018',
  database: 'tongxing',
  table: '_wechat_access_token_store_',
})

store.load('key').then(function(v) {
  console.log('v: ', v)
})
