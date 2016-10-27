var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res) {
	request(req.query.url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(body);
		}
	});
});

module.exports = router;