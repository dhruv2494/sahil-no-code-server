const mongoose = require("mongoose");

const endpointSchema = new mongoose.Schema({
  name: String,
  route: String,
  method: String,
});

const Endpoint = mongoose.model("Endpoint", endpointSchema);
module.exports = Endpoint;
