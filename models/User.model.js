// User model here
const mongoose = require("mongoose");

//define schema

let MySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

//define a model
let MyModel = mongoose.model(`myauthentication`, MySchema)

//export the model
module.exports = MyModel;
