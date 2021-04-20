const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id;
let replyId;
suite('Functional Tests', function () {
	test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
		chai
			.request(server)
			.post('/api/threads/:board')
			.send({
				board: 'test',
				text: 'test',
				delete_password: 'test',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				id = res.body[0]._id;
				done();
			});
	});
	test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', (done) => {
		chai
			.request(server)
			.get('/api/threads/test')
			.send()
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				done();
			});
	});
	test('Reporting a thread: PUT request to /api/threads/{board}', (done) => {
		chai
			.request(server)
			.put('/api/threads/:board')
			.send({ board: 'test', thread_id: id })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
				done();
			});
	});
	test('Creating a new reply: POST request to /api/replies/{board}', (done) => {
		chai
			.request(server)
			.post('/api/replies/:board')
			.send({
				board: 'test',
				thread_id: id,
				delete_password: 'test',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				const thread = res.body.find((thread) => thread._id == id);
				replyId = thread.replies[0]._id;
				done();
			});
	});
	test('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done) => {
		chai
			.request(server)
			.get(`/api/replies/test?thread_id=${id}`)
			.send()
			.end((err, res) => {
				assert.equal(res.status, 200);
				const reply = res.body.replies.find((reply) => reply._id == replyId);
				assert.equal(reply._id, replyId);
				done();
			});
	});

	test('Reporting a reply: PUT request to /api/replies/{board}', (done) => {
		chai
			.request(server)
			.put('/api/replies/:board')
			.send({
				board: 'test',
				thread_id: id,
				reply_id: replyId,
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
				done();
			});
	});
	test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', (done) => {
		chai
			.request(server)
			.delete('/api/replies/:board')
			.send({
				board: 'test',
				thread_id: id,
				reply_id: replyId,
				delete_password: 'fail',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'incorrect password');
				done();
			});
	});
	test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', (done) => {
		chai
			.request(server)
			.delete('/api/replies/:board')
			.send({
				board: 'test',
				thread_id: id,
				reply_id: replyId,
				delete_password: 'test',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
				done();
			});
	});
	test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
		chai
			.request(server)
			.delete('/api/threads/:board')
			.send({
				board: 'test',
				thread_id: id,
				delete_password: 'fail',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'incorrect password');
			});
		done();
	});
	test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', (done) => {
		chai
			.request(server)
			.delete('/api/threads/:board')
			.send({
				board: 'test',
				thread_id: id,
				delete_password: 'test',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
			});
		done();
	});
});
