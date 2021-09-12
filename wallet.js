const utils = require('./utils.js');
const crypto = require('crypto');
const utf8 = require('utf8');


const prime_length = 60;
const diffHell = crypto.createDiffieHellman(prime_length);

class Wallet {
    constructor() {
        this._private_key = diffHell.getPrivateKey('hex');
        this._public_key = diffHell.getPublicKey('hex');
        this._blockchain_address = this.generate_blockchain_address();
    }

    public_key() {
        return this._public_key.toString(16);
    }

    private_key() {
        return this._private_key.toString(16);
    }

    blockchain_address() {
        return this._blockchain_address;
    }

    generate_blockchain_address() {
        sha256_bpk = crypto.createHash('sha256').update(this.public_key()).digest('hex')
        let zero = 0;
        network_byte = '00'.toString(2);
        ripemed160_bpk = crypto.createHash('rmd120').update(this.public_key()).digest('hex')
        network_bitcoin_public_key = network_byte + ripemed160_bpk
        network_bitcoin_public_key_bytes = parseInt(network_bitcoin_public_key, 16)

        sha256_bpk = crypto.createHash('sha256').update(this.network_bitcoin_public_key_bytes).digest('hex')
        sha256_2_nbpk = crypto.createHash('sha256').update(sha256_bpk).digest('hex')

        checksum = sha256_2_nbpk[0, 8]
        address_hex = utf8.decode(network_bitcoin_public_key + checksum)
        blockchain_address = utf8.decode(address_hex.toString('base58'))
        return blockchain_address
    }
}

class Transaction {
    constructor(sender_private_key, sender_public_key,
        sender_blockchain_address, recipient_blockchain_address,
        value) {
        this.sender_private_key = sender_private_key
        this.sender_public_key = sender_public_key
        this.sender_blockchain_address = sender_blockchain_address
        this.recipient_blockchain_address = recipient_blockchain_address
        this.value = value
    }

    generate_signature() {
        transaction = utils.sorted_dict_by_key({
            'sender_blockchain_address': this.sender_blockchain_address,
            'recipient_blockchain_address': this.recipient_blockchain_address,
            'value': parseFloat(this.value)
        })
        message = crypto.createHash('sha256').update(JSON.stringify(transaction)).digest('hex')
        const sign = crypto.createSign('RSA-SHA256');
        return sign.sign(message, "hex");

    }
}

module.exports = { Wallet, Transaction };
