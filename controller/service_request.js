const service = require("../blockchain/service")
const FUNC_CREATE_USER = "createUser"
const FUNC_CREATE_WALLET = "createWallet"
//const FUNC_QUERY = "query"
const parseAttrs = require('./parseAttrs')
const FUNC_QUERY_USER = "queryUser"
const FUNC_QUERY_Wallet = "queryWallet"


class request{

    // getDate(){
    //     var date = {
    //         date : new Date()
    //     }
    //     console.log(date)
    //     return date
    // }

    async createUser(req){
        var user = req.user.toString().toLowerCase();
        var array = await new parseAttrs().createUser(req)
        var result =  await new service().invoke(user,FUNC_CREATE_USER,array)
        return result
    }

    async createWallet(req){
        var user = req.user.toString().toLowerCase();
        var array = await new parseAttrs().createWallet(req)
        var result =  await new service().invoke(user,FUNC_CREATE_WALLET,array)
        return result
    }

    async query(req){
        var stdID = req.StdID.toLowerCase();
        stdID = "StdID|"+stdID
        var walletName = req.WalletName.toLowerCase();
        walletName = "walletName|"+walletName
        var result =  await new service().query("user1",stdID,walletName)
        return result
    }

    async queryUser(req){
        var user = req.user.toLowerCase();
        var stdID = "stdID|"+req.stdID.toLowerCase();
        //stdID = "stdID|"+stdID
        var result =  await new service().queryUser(user,stdID)
        return result
    }

    async queryWallet(req){
        var user = req.user.toLowerCase();
        var walletName = "WalletName|"+req.walletName.toLowerCase();
        //walletName = "WalletName|"+walletName
        var result =  await new service().queryWallet(user,walletName)
        return result
    }


    async registerUser(req){
        var user = req.user.toLowerCase()
        var result = await new service().registerUser(user)
        return result
    }

}
module.exports = request