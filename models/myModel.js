const mongoose = require('mongoose');

var Schema = mongoose.Schema;
// var WorkerModel = new Schema({
// 		keyword: [String],
// 		lineUp: [{given_name: String, last_name: String, telegram_acc: String}],
// 		team: String
// 	});

var WorkerModel = new Schema({
	given_name: String, last_name: String
});

module.exports = mongoose.model('workers', WorkerModel);
