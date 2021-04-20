const { Thread } = require('../models/models');
const { getAndCreateBoard, getBoard } = require('./getBoard');

const createThread = async (req, res) => {
	const { board, text, delete_password } = req.body;

	if (!board || !text || !delete_password)
		return res.status(200).json({ error: 'empty fields' });

	// const hash = bcrypt.hashSync(delete_password, 13);
	const boardData = await getAndCreateBoard(board);

	const thread = new Thread({
		board,
		text,
		delete_password,
	});

	boardData.threads.push(thread);

	boardData.save();

	return res.status(200).json(boardData.threads);
};
const readThreads = async (req, res) => {
	const { board } = req.params;
	const boardData = await getBoard(board);
	if (!boardData) return res.status(200).json({ error: "Board doesn't exist" });
	const displayedThreads = boardData.threads.slice(0, 10).map((thread) => {
		const replies = thread.replies
			.slice(thread.replies.length - 4)
			.map((reply) => {
				const obj = {
					_id: reply._id,
					text: reply.text,
					created_on: reply.created_on,
				};
				return obj;
			});
		return {
			_id: thread._id,
			replies,
			board: thread.board,
			text: thread.text,
			created_on: thread.created_on,
			bumped_on: thread.bumped_on,
		};
	});
	return res.status(200).json(displayedThreads);
};
const updateThread = async (req, res) => {
	const { board, thread_id } = req.body;
	const boardData = await getBoard(board);
	if (!boardData) return res.status(200).send("Doesn't exist");
	const thread = boardData.threads.find((thread) => {
		return thread._id == thread_id
	});

	if (!thread) return res.status(200).send("Thread doesn't exist");
	boardData.threads = boardData.threads.map((thread) => {
		if (thread._id == thread_id) {
			thread.reported = true;
		}
		return thread;
	});
	boardData.save();

	return res.status(200).send('success');
};
const deleteThread = async (req, res) => {
	const { board, thread_id, delete_password } = req.body;
	const boardData = await getBoard(board);

	if (!boardData) return res.status(200).json({ error: "Board doesn't exist" });

	const thread = boardData.threads.find((thread) => {
		return thread._id == thread_id && thread.delete_password == delete_password;
	});

	if (thread) {
		boardData.threads = boardData.threads.filter((thread) => {
			return thread._id != thread_id;
		});
		boardData.save();

		return res.status(200).send('success');
	}

	return res.status(200).send('incorrect password');
};

module.exports = {
	createThread,
	readThreads,
	updateThread,
	deleteThread,
};
