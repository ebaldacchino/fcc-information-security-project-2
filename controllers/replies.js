const bcrypt = require('bcrypt');
const { Reply, Board } = require('../models/models');
const { getAndCreateBoard, getBoard } = require('./getBoard');

const createReply = async (req, res) => {
	const { board, thread_id, text, delete_password } = req.body;
	const boardData = await getBoard(board);

	if (!boardData) return res.status(200).json({ error: "board doesn't exist" });

	const reply = new Reply({
		text,
		delete_password,
	});

	boardData.threads = boardData.threads.map((thread) => {
		if (thread._id == thread_id) {
			thread.bumped_on = new Date().toISOString();
			thread.replies.push(reply);
		}
		return thread;
	});

	boardData.save();

	return res.status(200).json(boardData.threads);
};
const readReply = async (req, res) => {
	const { thread_id } = req.query;
	const { board } = req.params;

	if (!thread_id || !board) return res.status(200).json([]);

	const boardData = await getBoard(board);

	if (!boardData) return res.status(200).json({ error: "board doesn't exist" });

	const thread = boardData.threads.find((thread) => thread._id == thread_id);

	const { text, _id, created_on, bumped_on, replies } = thread;

	return res.status(200).json({
		_id,
		board,
		text,
		created_on,
		bumped_on,
		replies,
	});
};
const updateReply = async (req, res) => {
	const { board, thread_id, reply_id } = req.body;

	const boardData = await getBoard(board);
	if (!boardData) return res.status(200).send("Doesn't exist");

	const thread = boardData.threads.find((thread) => {
		return thread._id == thread_id;
	});

	if (!thread) return res.status(200).send("Thread doesn't exist");

	const reply = thread.replies.find((reply) => {
		return reply._id == reply_id;
	});

	if (!reply) return res.status(200).send('incorrect password');

	const newThreads = boardData.threads.map((thread) => {
		if (thread._id == thread_id) {
			thread.replies = thread.replies.map((reply) => {
				if (reply._id == reply_id) {
					reply.reported = true;
				}

				return reply;
			});
		}
		return thread;
	});

	boardData.threads = newThreads;

	boardData.save();

	return res.status(200).send('success');
};
const deleteReply = async (req, res) => {
	const { board, thread_id, reply_id, delete_password } = req.body;
	const boardData = await getBoard(board);

	if (!boardData) return res.status(200).json({ error: "board doesn't exist" });

	const thread = boardData.threads.find((thread) => {
		return thread._id == thread_id;
	});

	if (!thread) return res.status(200).send('incorrect password');

	const reply = thread.replies.find((reply) => {
		return reply._id == reply_id && reply.delete_password == delete_password;
	});

	if (!reply) return res.status(200).send('incorrect password');

	const newThreads = boardData.threads.map((thread) => {
		if (thread._id == thread_id) {
			thread.replies = thread.replies.map((reply) => {
				if (reply._id == reply_id) {
					reply.text = '[deleted]';
				}

				return reply;
			});
		}
		return thread;
	});

	boardData.threads = newThreads;

	boardData.save();

	return res.status(200).send('success');
};

module.exports = {
	createReply,
	readReply,
	updateReply,
	deleteReply,
};
