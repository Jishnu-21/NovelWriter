const mongoose = require('mongoose');


const ChoiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  nextPageIndex: { type: Number, required: false }, 
});

const PageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  choices: [ChoiceSchema],
  pageIndex: { type: Number, required: false, default: null },
  isEnd:{type:Boolean,default:false}
});

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  pages: [PageSchema]
});

module.exports = mongoose.model('Chapter', ChapterSchema);
