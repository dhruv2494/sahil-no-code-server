const mongoose = require('mongoose');

const DatabaseConnectionSchema = new mongoose.Schema({
    dbName: { type: String, required: true },
    connectionOptions: { type: mongoose.Schema.Types.Mixed, required: true }
});

const DatabaseConnection = mongoose.model('DatabaseConnection', DatabaseConnectionSchema);

module.exports = DatabaseConnection;
