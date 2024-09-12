const mongoose = require('mongoose');

const ReadingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  title: { type: String, required: true }, // Store the book title
  dateRead: { type: Date, default: Date.now }, // Date when the book was read
}, { timestamps: true });

module.exports = mongoose.model('ReadingHistory', ReadingHistorySchema);
