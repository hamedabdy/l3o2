var OAuth = require('oauth');
var logger = require('../logger').appLog;

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    'NPx4ECV9bXRBE2LJeZneuttzX',
    'OtP6Ob2lAZeSk7XFVjrVvfKtPUjimzbkCGzWAyOEds47eROtq7',
    '1.0A',
    'http://concert-dacote.com',
    'HMAC-SHA1'
    );

var access_token = '2310840488-krOGtmTqr8CTCjgtj5k3ZahiGJoOq8JTUQNCm8A';;
var access_token_secret = 'xIzTsp9LFzqAZnJjVbIXGkMVzXskP5kanlgzkvQCN4OHL';;


function postStatus(status) {
    oauth.post(
        'https://api.twitter.com/1.1/statuses/update.json',
        access_token,
        access_token_secret,
        {'status': status},
        function (e, data, res){
            if (e) logger.error(e);
            logger.info('Shared to Twitter');
        }
    );
}

exports.postStatus = postStatus;