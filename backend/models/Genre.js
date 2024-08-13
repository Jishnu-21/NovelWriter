const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true  },
  description: { type: String, required: true},
  isActive:{type:Boolean,default:true},
});

module.exports = mongoose.model('Genre', GenreSchema);