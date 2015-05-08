#!/usr/bin/env node


module.exports = {
	'url' : process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote' || process.env.MONGOLAB_URI
};