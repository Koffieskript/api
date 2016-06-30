const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Incident = new Schema({
  _id: { type: String },
  category: { type: String, ref: 'incidentCategory', required: true},
  cleaner: { type: String, ref: 'cleaner', required: false, default: null},
  location: { type: String, required: false },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, required: false, default: null},
  subscribedAt: { type: Date, required: false, default: null }
});

module.exports = mongoose.model('incident', Incident);
