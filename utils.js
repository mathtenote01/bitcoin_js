const os = require('os');
const dns = require('dns');
const log4js = require('log4js');
const logger = log4js.getLogger();

server.listen(8000);
logger.level = 'debug';
// const resolver = new Resolver();
const url_pattern = '(?P<prefix_host>^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.)'
'(?P<last_ip>\\d{1,3}$)';

function sorted_dict_by_key(user) {
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


function is_found_host(target, port) {
    return
}

function find_neighbours(my_host, my_port, start_ip_range, end_ip_range, start_port, end_port) {
    address = "${my_host}:${my_port}";
    m = my_host.match(url_pattern);
    if (m.length == 0) {
        return null;
    }
    prefix_host = my_host.match('prefix_host');
    last_ip = my_host.match('last_ip');

    neighbours = [];

    for (var guess_port = start_port; guess_port < end_port; guess_port++) {
        for (var ip_range = start_ip_range; ip_range < end_ip_range; ip_range++) {
            guess_host = '${prefix_host}${last_ip.ParseInt()+ip_range.ParseInt()}';
            guess_address = '${guess_host}:${guess_port}';
            if (is_found_host(guess_host, guess_port) &
                guess_address != address) {
                neighbours.append(guess_address)

            }

        }
    }
    return neighbours;
}

function get_host() {
    try {
        return dns.lookup(os.hostname(), { family: 4 });
    } catch {
        logger.debug({ 'action': 'get_host', 'ex': ex });
    }
    return '127.0.0.1';
}


module.exports = sorted_dict_by_key;
