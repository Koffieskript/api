const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cleanerSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.Now }
});

module.exports = mongoose.model('cleaner', cleanerSchema);
