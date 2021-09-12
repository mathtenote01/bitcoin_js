const utils = require('./utils.js');
const request = require('request');
const crypto = require('crypto');
const cryptoHash = require("./crypto-hash.js");
const log4js = require('log4js');
const utf8 = require('utf8');
const cluster = require('cluster');
const express = require('express');
const numCPUs = require('os').cpus().length;
const capacity = 1;
const semaphore = require('semaphore');
const { response } = require('./app.js');

MINING_DIFFICULTY = 3;
MINING_SENDER = 'THE BLOCKCHAIN';
MINING_REWARD = 1.0;


const logger = log4js.getLogger();
logger.level = 'all';


class BlockChain {
    constructor({ blockchain_address = null, port = null }) {
        this.transaction_pool = [];
        this.chain = [];
        this.neighbours = [];
        this.create_block(0, this.hash({}));
        this.blockchain_address = blockchain_address;
        this.port = port;
        this.mining_semaphore = semaphore(1);
        this.sync_neighbours_semaphore = semaphore(1);
    }

    create_block(nonce, previous_hash) {
        var user = {
            'timestamp': time.time(),
            'transactions': self.transaction_pool,
            'nonce': nonce,
            'previous_hash': previous_hash
        };

        var result = {};
        var key = Object.keys(user);
        key.sort();
        for (var i = 0; i < key.length; i++) {
            result[key[i]] = user[key[i]];
        }
        this.chain.push(result);
        this.transaction_pool = [];
        return result;
    }

    run() {
        this.sync_neighbours();
        this.resolve_conflicts();
        this.start_mining();
    }

    set_neighbours() {
        this.neighbours = utils.find_neighbours(
            utils.get_host(), self.port,
            NEIGHBOURS_IP_RANGE_NUM[0], NEIGHBOURS_IP_RANGE_NUM[1],
            BLOCKCHAIN_PORT_RANGE[0], BLOCKCHAIN_PORT_RANGE[1])
        logger.info({
            'action': 'set_neighbours', 'neighbours': self.neighbours
        })
    }
    sync_neighbours() {
        is_acquire = this.sync_neighbours_semaphore.available;
        if (is_acquire == true) {

        }
    }

    hash(block) {
        return cryptoHash.cryptoHash(...block);
    }

    add_transaction(sender_blockchain_address,
        recipient_blockchain_address, value,
        sender_public_key = None, signature = None) {
        transaction = {};
        var user = {
            'sender_blockchain_address': sender_blockchain_address,
            'recipient_blockchain_address': recipient_blockchain_address,
            'value': value
        };
        var result = {};
        var key = Object.keys(user);

        key.sort();
        for (var i = 0; i < key.length; i++) {
            transaction[key[i]] = user[key[i]];
        }

        if (sender_blockchain_address == MINING_SENDER) {
            self.transaction_pool.append(transaction)
            return True;
        }
        if (verify_transaction_signature(
            sender_public_key, signature, transaction) == True) {
            transaction_pool.push(transaction);
            return True;
        }
        return false;
    }
    verify_transaction_signature(sender_public_key, signature, transaction) {
        message = crypto.createHash('sha256').update(utf8.encode(transaction)).digest('hex');
        signature_bytes = parseInt(signature, 16).toString(2);
        verifying_key = crypto.createVerify('RSA-SHA256');
        verifying_key.update(utf8.encode(sender_public_key).toString(2));
        verified_key = verifying_key.verify(signature_bytes, message, 'base64');

        return verified_key;
    }

    valid_proof(transactions, previous_hash, nonce,
        difficulty = MINING_DIFFICULTY) {
        guess_block = utils.sorted_dict_by_key({
            'transactions': transactions,
            'nonce': nonce,
            'previous_hash': previous_hash
        })
        guess_hash = this.hash(guess_block);
        quiz_hash = "";
        for (var i = 0; i < difficulty; i++) {
            quiz_hash = quiz_hash + "0";
        }
        if (guess_hash.substr(0, difficulty) == quiz_hash) {
            return True;
        }
    }
    proof_of_wort() {
        transactions = this.transaction_pool.slice(0, this.transaction_pool.length);
        previous_hash = this.hash(this.chain[-1]);
        nonce = 0;
        while (this.valid_proof(transactions, previous_hash, nonce) != True) {
            nonce += 1;
        }
        return nonce
    }
    minig() {
        this.add_transaction(
            sender_blockchain_address = MINING_SENDER,
            recipient_blockchain_address = this.blockchain_address,
            value = MINING_REWARD,
        )
        nonce = this.proof_of_work()
        previous_hash = this.hash(self.chain[-1])
        this.create_block(nonce, previous_hash)
        logger.info({ "action": "mining", "status": "success" })
        return True
    }
    culculate_total_amount(blockchain_address) {
        total_amount = 0.0
        //for block in self.chain:
        for (var i = 0; i < this.chain.length; i++) {
            for (var j = 0; j < block["transactions"].length; j++) {
                value = transaction["value"]
                if (blockchain_address == transaction["recipient_blockchain_address"]) {
                    total_amount += value
                }

                if (blockchain_address == transaction["sender_blockchain_address"]) {
                    total_amount -= value
                }
            }
        }
        return total_amount
    }
    valid_chain(chain) {
        pre_block = chain[0];
        current_index = 1;
        while (current_index < len(chain)) {
            block = chain[current_index];
            if (block['previous_hash'] != self.hash(pre_block)) {
                return false;
            }

            if (self.valid_proof(
                block['transactions'], block['previous_hash'],
                block['nonce'], MINING_DIFFICULTY) == true) {
                return false
            }

            pre_block = block
            current_index += 1
            return True
        }
    }
    resolve_conflicts() {
        longest_chain = null;
        max_length = this.chain.length;
        for (var i = 0; i < this.neighbours.length; i++) {
            response = request({
                url: 'http://${this.neighbours[i]}/chain',
                method: 'GET'
            })
            if (response.status_code == 200) {
                response_json = response.json()
                chain = response_json['chain']
                chain_length = len(chain)
                if (chain_length > max_length & this.valid_chain(chain)) {
                    max_length = chain_length;
                    longest_chain = chain;
                }
            }
        }
        if (longest_chain == True) {
            this.chain = longest_chain
            logger.info({ 'action': 'resolve_conflicts', 'status': 'replaced' })
            return True
        }
        logger.info({ 'action': 'resolve_conflicts', 'status': 'not_replaced' })
        return False
    }
}

module.exports = BlockChain;
