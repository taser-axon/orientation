var express = require('express');
var router = express.Router();

router.get('/:team', function(req, res) {
	res.render('./src/index', {
		title: 'TASER | Axon – Orientation',
		page: 'missions',
		team: req.params.team
	});
});

module.exports = router;
