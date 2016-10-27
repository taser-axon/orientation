var express = require('express');
var router = express.Router();

var Setup = require('../models/setup.js');

router.post('/', function(req, res) {
	var setup = new Setup(req.body);
	setup.save().then(function(model) {
		res.send(model);
	});
});

router.put('/:id', function(req, res) {
	var setup = new Setup(req.body);
	setup.save().then(function(model) {
		res.send(model);
	});
});

// router.delete('/:id', function(req, res) {
// 	var setup = new Setup({id: req.params.id});
// 	setup.destroy().then(function(model) {
// 		res.send(model);
// 	});
// });

router.get('/', function(req, res) {
	var setup = new Setup({id: 1});
	setup.fetch().then(function(model) {
		res.send(model);
	});
});

module.exports = router;
