const mongoose = require('mongoose');

const time = new Date().toISOString();

const ReplySchema = new mongoose.Schema({
	text: { type: String },
	delete_password: { type: String },
	created_on: { type: Date, default: time },
	reported: { type: Boolean, default: false },
});

const ThreadSchema = new mongoose.Schema({
	board: { type: String },
	text: { type: String },
	delete_password: { type: String },
	created_on: { type: Date, default: time },
	bumped_on: { type: Date, default: time },
	reported: { type: Boolean, default: false },
	replies: [ReplySchema],
});

const BoardSchema = new mongoose.Schema({
	title: { type: String },
	threads: [ThreadSchema],
});

const Thread = mongoose.model('Thread', ThreadSchema);
const Reply = mongoose.model('Reply', ReplySchema);

const Board = mongoose.model('Board', BoardSchema);

module.exports = {
	Thread,
	Reply,
	Board,
};
