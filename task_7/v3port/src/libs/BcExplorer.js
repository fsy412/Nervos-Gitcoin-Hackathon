import Web3 from 'web3'
const Users = require('../assets/contract/Users.json')
import { CONFIG } from '../assets/config.ts';

const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");
// import { AddressTranslator } from 'nervos-godwoken-integration';
// const AddressTranslator = require('./nervos-godwoken-integration.js')

class BcExplorer {
    constructor() {
        this.web3inst = null; // store the web3 instace
        this.contractInst = null; // store the smart contract instance

        // general info about connection and user information
        this.info = {
            isConnected: false,
            networkId: 0,
            coinbase: null,
            mainAccount: null,
            balance: 0,
            addressUrl: null,
        };
    }

    init(addressUrl) {
        return new Promise((resolve, reject) => {
            if (window.ethereum) {
                try {
                    window.ethereum.send("eth_requestAccounts").then((accounts) => { console.log(accounts) });

                } catch (err) {
                    console.log("User cancelled");
                    console.log(err);
                }
                try {
                    window.ethereum.enable()
                        .then(() => {
                            const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
                            const polyjuiceConfig = {
                                rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
                                ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
                                web3Url: godwokenRpcUrl
                            };
                            const provider = new PolyjuiceHttpProvider(
                                CONFIG.WEB3_PROVIDER_URL,
                                polyjuiceConfig,
                            );
                            window.web3 = new Web3(provider);
                            this.setWeb3(window.web3, addressUrl);
                            resolve(window.web3);
                        })
                        .catch(
                            error => reject(error)
                        );
                } catch (error) {
                    reject(error);
                }
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
                return null;
            }
        })
    }

    setWeb3(web3js, addressUrl) {
        this.info.addressUrl = addressUrl;
        this.web3inst = web3js;
        this.info.isConnected = true;
        this.loadInfo();
    }

    initContract() {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const polyjuiceConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };
        const provider = new PolyjuiceHttpProvider(
            CONFIG.WEB3_PROVIDER_URL,
            polyjuiceConfig,
        );
        var web3 = window.web3
        web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
        web3.eth.Contract.setProvider(provider, web3.eth.accounts);
        const contract = new web3.eth.Contract(Users.abi, CONFIG.CONTRACT_ADDRESS);

        this.contractInst = contract;
    }

    initPolyAndContract() {
        return new Promise((resolve, reject) => {
            this.init('https://godwoken-testnet-web3-rpc.ckbapp.dev')
                .then(() => resolve(
                    this.initContract()))
                .catch(error => reject(error));
        });
    }
    getInfo(attr) {
        if (attr) return this.info[attr];
        return this.info;
    }
    web3() {
        // if (typeof web3 !== 'undefined') return web3;
        if (typeof window.web3 !== 'undefined') return window.web3;
        if (this.web3inst) return this.web3inst;

        console.error('BcExplorer error: Web3 is not initialized.');
    }
    isConnected() {
        return this.info.isConnected;
    }
    contract() {
        return this.contractInst;
    }
    getMainAccount() {
        return new Promise((resolve, reject) => {
            try {
                window.ethereum.send("eth_requestAccounts").then((accounts) => { resolve(accounts.result[0]) });
            } catch (err) {
                reject(err)
            }
        });
    }


    async loadInfo() {
        var ret = await window.ethereum.send("eth_requestAccounts")
        var account = ret.result[0]
        console.log('1111',account)
        var bal = await window.web3.eth.getBalance(account)
        console.log(bal)
        // const addressTranslator = new AddressTranslator();
        // const depositAddress = await addressTranslator.getLayer2DepositAddress(window.web3, account);
        // console.log(depositAddress.addressString)


        try {
            return Promise.resolve(this.info);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    weiToEther(bal) {
        if (typeof bal == 'object') {
            bal = bal.toNumber();
        }
        return bal
        // return window.web3.utils.fromWei(bal.toString(), 'ether');
    }
    toAscii(bytes) {
        return window.web3.utils.hexToAscii(bytes);
    }
    toDate(timestamp) {
        return new Date(timestamp * 1000).toISOString();
    }
}

export default BcExplorer;
