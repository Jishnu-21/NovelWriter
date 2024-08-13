const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NodeSchema = new Schema({
  storyId: {
    type: Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  choices: [
    {
      choiceId: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      nextNodeId: {
        type: Schema.Types.ObjectId,
        ref: 'Node',
        required: true
      }
    }
  ]
});

const NodeModel = mongoose.model('Node', NodeSchema);
module.exports = NodeModel;
