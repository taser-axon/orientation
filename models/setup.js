var bookshelf = require('../db.js');

var Setup = bookshelf.Model.extend({
	tableName: 'orientation-setup'
});

module.exports = Setup;
