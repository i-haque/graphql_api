const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  clientID: { type: Schema.Types.ObjectId, ref: 'Client' },
  name: { type: String },
  description: { type: String },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
  },
});

const Project = model('project', projectSchema);

module.exports = Project;
