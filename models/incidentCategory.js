const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incidentCategoryScheme = new Schema({
  _id: { type: String },
  icon: { type: String, required: true },
  title: { type: String, required: true }
});

module.exports = mongoose.model('incidentCategory', incidentCategoryScheme);
