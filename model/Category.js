const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

//create schema
const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
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

categorySchema.plugin(mongooseHidden);

//Compile schema into model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
