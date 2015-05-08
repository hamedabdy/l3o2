#!/usr/bin/env node


module.exports = {
	'url' : process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/concertdacote'
};