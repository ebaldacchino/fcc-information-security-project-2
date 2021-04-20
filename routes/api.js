'use strict';

const {
	createThread,
	readThreads,
	updateThread,
	deleteThread,
} = require('../controllers/threads');

const {
	createReply,
	readReply,
	updateReply,
	deleteReply,
} = require('../controllers/replies');

module.exports = function (app) {
	app
		.route('/api/threads/:board')
		.post(createThread)
		.get(readThreads)
		.put(updateThread)
		.delete(deleteThread);

	app
		.route('/api/replies/:board')
		.post(createReply)
		.get(readReply)
		.put(updateReply)
		.delete(deleteReply);
};
