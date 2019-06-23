const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet,X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const util = require('util')

const CONFIG_CHANNEL_NAME = "mychannel"
const CONFIG_CHAINCODE_NAME = "mychaincode"

const walletPath = path.join(process.cwd(), './blockchain/config/wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

const ccpPath = path.resolve(__dirname,  '..', 'blockchain', 'config' , 'connection1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);



class service {
    /*
 * SPDX-License-Identifier: Apache-2.0
 */

    //  'use strict';

    async invoke(user, functionName, args) {


        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (!userExists) {
                console.log('An identity for the user user1  does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);

            // Get the contract from the network.
            const contract = network.getContract(CONFIG_CHAINCODE_NAME);

            //change json ---> array
            const argsString = args.map((arg) => util.format('%s', arg)).join('|');
            //await contract.submitTransaction(functionChaincode, argsString);

            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')


            await contract.submitTransaction(functionName, argsString);
            //await contract.submitTransaction(functionName, args.WalletName, args.Money, args.Owner);
            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted'

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            //process.exit(1);
            return `Failed to submit transaction: ${error}`
        }
    }

    async queryUser(user,key) {

        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: user, discovery: { enabled: false } });
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
            const contract = network.getContract(CONFIG_CHAINCODE_NAME);


            var result = await contract.evaluateTransaction('query', key);
            console.log(`Transaction has been evaluated, result is: ${'name = ' + result.toString()}`);
            //result = `Transaction has been evaluated, result is: ${'name = ' + result.toString()}`
            return JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            //process.exit(1);
            return `Failed to evaluate transaction: ${error}`
        }
    }


    async queryWallet(user,key) {

        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: user, discovery: { enabled: false } });
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
            const contract = network.getContract(CONFIG_CHAINCODE_NAME);


            var result = await contract.evaluateTransaction('query', key);
            console.log(`Transaction has been evaluated, result is: ${'wallet = ' + result.toString()}`);
            //result = `Transaction has been evaluated, result is: ${'wallet = ' + result.toString()}`
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            //process.exit(1);
            return `Failed to evaluate transaction: ${error}`
        }
    }
    //enrollAdmin
    async init() {
        console.log('BIG KAK')
        let functionName = `[Blockchain.service.init()]`
        try {
            const caInfo = ccp.certificateAuthorities['ca1.example.com'];
            const ca = new FabricCAServices(caInfo.url); //{ trustedRoots: ' ', verify: false }, caInfo.caName);

            console.log('BIG KAK222222')

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');

            if (!adminExists) {
                const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
                const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
                await wallet.import('admin', identity);
                console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            }
            console.log('BIG KAK333333333')

            // Enroll the admin user, and import the new identity into the wallet.
            console.log(`${functionName} We are ready to do some blockchain`)
            return 
        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            //process.exit(1);
            return `Failed to enroll admin user "admin": ${error}`
        }
    }

    async registerUser(user) {
        let functionName = `[Blockchain.service.init()]`

        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (userExists) {
                console.log('An identity for the user' + user + 'already exists in the wallet');
                return;
            }
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (!adminExists) {
                console.log('An identity for the admin user1 "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: false } });
    
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
    
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: user, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            await wallet.import(user, userIdentity);
            console.log('Successfully registered and enrolled admin user '+ user +' and imported it into the wallet');
            return (`${functionName} We are ready to do some blockchain`)
        } catch (error) {
            console.error(`Failed to register user "user1" : ${error}`);
            //process.exit(1);
            return `Failed to register user "user1": ${error}`
        }
    }

}
module.exports = service
