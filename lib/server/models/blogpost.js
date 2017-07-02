const mongoose = require("mongoose");
const marked = require("marked");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: String,
	content: String,
	createdTS: {type: Date, default: new Date()},
	updatedTS: Date
});

const blogPostSchema = new Schema({
	title: String,
	description: String,
	prettyURL: {type: String, required: true},
	thumbnail: String,
	author: String,
	content: String,
	tags: [String],
	comments: [commentSchema],
	createdTS: {type: Date, default: new Date()},
	updatedTS: Date,
	relatedPosts: {type: Array, default: []}
}, {
	collection: "blogpost"
});

blogPostSchema.methods.renderContent = function() {
	return marked(this.content);
};

module.exports = mongoose.model("BlogPost", blogPostSchema);
