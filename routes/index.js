// blockchain_serverのつもり

const { json } = require('express');
const express = require('express');
const { response } = require('../app');
const { Wallet, Transaction } = require('../wallet');
const router = express.Router();
const url = require('url');


cache = {}
function get_blockchain() {
  cached_blockchain = cache.get('blockchain');
  if (cached_blockchain == null) {
    miners_wallet = Wallet.Wallet()
    miners_wallet = wallet.Wallet()
    cache["blockchain"] = blockchain.BlockChain(
      blockchain_address = miners_wallet.blockchain_address, port = app.config["port"]
    )
    app.logger.warning(
      {
        "private_key": miners_wallet.private_key,
        "public_key": miners_wallet.public_key,
        "blockchain_address": miners_wallet.blockchain_address,
      }
    )
  }
  return cache["blockchain"]
}



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/chain', function (req, res, next) {
  block_chain = get_blockchain()
  response = { "chain": block_chain.chain }
  res.render('index', response);
});


router.post('/transactions', function (req, res, next) {
  block_chain = get_blockchain()

  if (req.method == "GET") {
    transactions = block_chain.transaction_pool
    response = { "transactions": transactions, "length": len(transactions) };
    res.render('index', response);
  }

  if (req.method == "POST") {
    request_json = JSON.parse(req.toString());
    required = [
      "sender_blockchain_address",
      "recipient_blockchain_address",
      "value",
      "sender_public_key",
      "signature",
    ]
    all_complete = true;

    for (var i = 0; i < required.length; i++) {
      if (required[i] in request_json == false) {
        all_complete = false;
      }
    }
    is_created = block_chain.create_transaction(
      request_json["sender_blockchain_address"],
      request_json["recipient_blockchain_address"],
      request_json["value"],
      request_json["sender_public_key"],
      request_json["signature"],
    )
    if (all_complete == false & is_created == true) {
      res.render('index', { "message": "missing values" });
    }

    if (is_created == false) {
      res.render('index', { "message": "fail" });
    }
    if (all_complete == true & is_created == true) {
      res.render('index', { "message": "success" });
    }
  }

  if (req.method == "PUT") {
    request_json = JSON.parse(req);
    required = [
      "sender_blockchain_address",
      "recipient_blockchain_address",
      "value",
      "sender_public_key",
      "signature",
    ]
    all_complete = true;

    for (var i = 0; i < required.length; i++) {
      if (required[i] in request_json == false) {
        all_complete = false;
      }
    }
    is_updated = block_chain.add_transaction(
      request_json["sender_blockchain_address"],
      request_json["recipient_blockchain_address"],
      request_json["value"],
      request_json["sender_public_key"],
      request_json["signature"],
    )
    if (all_complete == false & is_updated == true) {
      res.render('index', { "message": "missing values" });
    }

    if (is_updated == false) {
      res.render('index', { "message": "fail" });
    }
    if (all_complete == true & is_updated == true) {
      res.render('index', { "message": "success" });
    }
  }

  if (request.method == "DELETE") {
    block_chain.transaction_pool = []
    res.render("blockchain", { 'message': 'success' })
  }
})

router.get('/mine', function (req, res, next) {
  block_chain = get_blockchain()
  is_mined = block_chain.mining()
  if (is_mined == true) {
    res.render('index', { "message": "success" });
  } else {
    res.render('index', { "message": "fail" });
  }

});

router.get('/mine/start', function (req, res, next) {
  get_blockchain().start_mining()
  res.render('blockchain', { "message": "success" });
});

router.put('./consensus', function (req, res, next) {
  block_chain = get_blockchain();
  replaced = block_chain.resolve_conflicts();
  res.render('blockchain', { "message": "success" });
})

router.get('/amount', function (req, res, next) {
  blockchain_address = url.parse(req.url, true);
  res.render('blockchain', {
    'amount': get_blockchain().calculate_total_amount(blockchain_address)
  });
})
module.exports = router;
