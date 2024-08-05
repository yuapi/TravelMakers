const storage = require('./storage.js');

exports.createPost = async (event) => {
	if (!event.body) return { statusCode: 404 };

	const { userId, title, content } = JSON.parse(event.body);

	const res = await storage.insert({ userId, title, content });
	if (!res) return { statusCode: 400 };

	return { res, title };
}

exports.readPost = async (event) => {
	if (!event.pathParameters || !event.pathParameters["postId"]) return { statusCode: 404 };

	const post = await storage.select(event.pathParameters.postId);
	if (!post) return { statusCode: 404 };

	return post;
}

exports.updatePost = async (event) => {
	if (!event.body || !event.pathParameters || !event.pathParameters["postId"]) return { statusCode: 404 };

	const postId = event.pathParameters.postId;
	const { title, content } = JSON.parse(event.body);

	if (!(await storage.update(postId, { title, content }))) return { statusCode: 400 };

	return { title };
}

exports.deletePost = async (event) => {
	if (!event.pathParameters || !event.pathParameters["postId"]) return { statusCode: 404 };

	await storage.remove(event.pathParameters.postId);

	return { statusCode: 200 };
}

exports.listPosts = async (event) => {
	return storage.list();
}
