const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  coverPage: { type: String }, // Path or filename of the uploaded photo
  description: { type: String },
  genre: { type: String },
  rating: { type: String, enum: ['Adult', 'PG13', 'Teen', 'E'] },
  name: { type: String },
  publishingDate: { type: Date },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
  isBlocked:{type:Boolean,default:false},
});

module.exports = mongoose.model('Story', storySchema);
