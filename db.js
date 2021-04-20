const mongoose = require('mongoose');

module.exports = mongoose
	.connect(
		process.env.DB,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		},
		console.log('Database connected successfully')
	)
	.catch((err) => console.log('Database connected unsuccessfully'));
