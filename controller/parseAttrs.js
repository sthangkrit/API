
//Attribute  
class passeAttrs {

    createUser(args) {
        let array = [
            args.name.toString().toLowerCase(),
            args.stdID.toString(),
            args.tel.toString()
        ]
        return array
    }

    createWallet(args) {
        let array = [
            args.walletName.toString().toLowerCase(),
            args.money.toString(),
            args.owner.toString()
        ]
        return array
    }

}
module.exports = passeAttrs