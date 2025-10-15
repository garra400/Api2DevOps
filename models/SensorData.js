const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({

    sensorId: { type: String, require: true },
    dataValue: { type: Float32Array, require: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model("SensorData", SensorDataSchema, 'SensorData');