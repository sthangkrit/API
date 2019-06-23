var express = require('./config/express')
var app = express()

var service = require('./blockchain/service')
//var mongoose = require('./config/mongoose')
//var db = mongoose();
new service().init();

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log('Start server at port ' + port)
})
