var express = require('express')
var bodyParser = require('body-parser')
module.exports = function()
{
    var app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    require('../router/index.js')(app)
    return app
}
