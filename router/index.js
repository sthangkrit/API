module.exports = function (app) {
    var request = require('../controller/service_request')

//adduser
    // app.post('/adduser',async(req, res) =>{
    // var result = (await new index().adduser(req.body))
    // res.json(result)
    // }\)
    app.post('/getData',async function(req,res){
        var result = (await new request().getDate())
        res.json(result)
    })

    app.post('/createUser',async function(req,res){
        var result = (await new request().createUser(req.body))
        res.json(result)
    })

    app.post('/createWallet',async function(req,res){
        var result = (await new request().createWallet(req.body))
        res.json(result)
    })

    app.post('/query',async function(req,res){
        var result = (await new request().query(req.body))
        res.json(result)
    })

    app.post('/blockchain/registerUser',async function(req,res){
        var result = (await new request().registerUser(req.body))
        res.json(result)
    })

    app.post('/queryUser',async function(req,res){
        var result = (await new request().queryUser(req.body))
        res.json(result)
    })

    app.post('/queryWallet',async function(req,res){
        var result = (await new request().queryWallet(req.body))
        res.json(result)
    })



    
}   