const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  coverPage: { type: String }, // Path or filename of the uploaded photo
  description: { type: String },
  genre: { type: String },
  rating: { type: String, enum: ['Adult', 'PG13', 'Teen', 'E'] },
  name: { type: String },
  publishingDate: { type: Date },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isBlocked: { type: Boolean, default: false },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  likes: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
});

module.exports = mongoose.model('Story', storySchema);
