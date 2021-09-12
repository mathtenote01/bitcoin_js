const express = require('express');
const router = express.Router();
const wallet = require('../wallet.js');
const request = require('request');
const { response } = require('../app');
const urljoin = require('url-join');
const { json } = require('express');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.post('/wallet', function (req, res, next) {
    my_wallet = wallet.Wallet()
    response = {
        'private_key': my_wallet.private_key,
        'public_key': my_wallet.public_key,
        'blockchain_address': my_wallet.blockchain_address,
    }
    res.render('index', { "message": response });
});


router.post('/transaction', function (req, res, next) {
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

    if (all_complete == true) {
        res.render('index', { "message": 'missing values' });
    }

    sender_private_key = request_json['sender_private_key']
    sender_blockchain_address = request_json['sender_blockchain_address']
    recipient_blockchain_address = request_json['recipient_blockchain_address']
    sender_public_key = request_json['sender_public_key']
    value = parseFloat(request_json['value'])

    transaction = wallet.Transaction(
        sender_private_key,
        sender_public_key,
        sender_blockchain_address,
        recipient_blockchain_address,
        value)

    json_data = {
        'sender_blockchain_address': sender_blockchain_address,
        'recipient_blockchain_address': recipient_blockchain_address,
        'sender_public_key': sender_public_key,
        'value': value,
        'signature': transaction.generate_signature(),
    }
    response = request({
        url: urljoin(app.config['gw'], 'transactions'),
        method: 'POST',
        form: json_data
    })
    if (response.statusCode == '201') {
        res.render('blockchain', { 'message': 'success' });
    } else {
        res.render('blockchain', { 'message': 'fail', 'response': response })
    }

});

router.get('/wallet/amount', function (req, res, next) {
    required = ['blockchain_address'];
    all_complete = True;
    for (i = 0; i < required.length; i++) {
        if (required[i] in req.params == false) {
            all_complete = false
        }
    }
    my_blockchain_address = req.params.get('blockchain_address');
    response = request({
        url: urljoin(app.config['gw'], 'amount'),
        method: 'GET',
        json: { 'blockchain_address': my_blockchain_address }
    })
    if (response.status_code == 200) {
        total = JSON(response)['amount'];
        res.render('blockchain', { 'message': 'success', 'amount': total });
    } else {
        res.render('blockchain', { 'message': 'fail', 'error': response.content });
    }


});


module.exports = router;
