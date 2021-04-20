const { Board } = require('../models/models');

const getAndCreateBoard = async (board) => {
	try {
		const boardData = await Board.findOne({ title: board });
		if (boardData) return boardData;

		const newBoard = new Board({
			title: board,
		});
		await newBoard.save();
		return newBoard;
	} catch (err) {
		console.log('Error fetching board data');
	}
	return 'Nothing happened when getting board';
};

const getBoard = async (board) => {
	try {
		const boardData = await Board.findOne({ title: board });
		if (boardData) return boardData;
	} catch (err) {
		console.log('Error fetching board data');
	}
	return null;
};

module.exports = { getAndCreateBoard, getBoard };
