const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batterySchema = new Schema({
  _id: { type: String },
  batteryPercentage: { type: Number, required: true, default: 0 },
  amountFullBatteries: { type: Number, required: false, default: 0 },
  lastFullBattery: { type: Date, required: false, default: null},
  wasFull: { type: Boolean, required: false, default: false}
});

module.exports = mongoose.model('battery', batterySchema);
