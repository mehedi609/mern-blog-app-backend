const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is required'],
    },
    description: {
      type: String,
      required: [true, 'Comment description is required'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
);

// hide __v and _id properties
commentSchema.plugin(mongooseHidden);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
