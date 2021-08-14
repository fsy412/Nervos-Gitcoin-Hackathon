import BcExplorer from './BcExplorer'

export default {
    data() {
        return {
            bcConnected: false, // true when the connection with the blockchain is established, plus the contract ABI + address is correctli initialized
            bcConnectionError: false,
            errorConnectionMessage: null,
            bcSmartContractAddressError: false
        }
    },

    created() {
        this.init();
    },

    methods: {
        init() {
            if (window.bc == undefined) {
                window.bc = new BcExplorer;
                window.bc.initPolyAndContract()
                    .then((error) => {
                        if (error) {
                            this.bcConnected = false;
                            this.showConnectionErrorMessage(error);
                        } else {
                            this.isRegistered()
                                .then(res => {
                                    console.log("res", res)
                                    this.bcConnectionError = false;
                                    this.bcConnected = this.blockchainIsConnected();
                                })
                                .catch(error => {
                                    this.showConnectionErrorMessage(error);
                                    this.bcSmartContractAddressError = true;
                                });
                        }
                    })
                    .catch(error => this.showConnectionErrorMessage(error));
            }
        },
        isRegistered() {
            return new Promise((resolve, reject) => {
                window.bc.getMainAccount()
                    .then(account => {
                        window.bc.contract().methods.isRegistered().call({
                            from: account
                        }).then(ret => {
                            resolve(ret);
                        })
                    })
                    .catch(error => reject(error));
            });
        },
        showConnectionErrorMessage(error = null) {
            this.bcConnectionError = true;
            if (error && error.message) {
                this.errorConnectionMessage = error.message;
            }
        },
        blockchainIsConnected() {
            this.bcConnected = ((window.bc != undefined) && window.bc.isConnected());
            return this.bcConnected;
        },
        toAscii(bytesStr) {
            return bytesStr
            // return window.bc.toAscii(bytesStr);
        },
        toDate(timestamp) {
            return new Date(timestamp * 1000).toISOString();
        }
    }
}
