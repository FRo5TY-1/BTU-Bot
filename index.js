
console.clear();

const Client = require("./Structures/Client.js");
const client = new Client();
const mongoose = require("mongoose");

//process.env.MONGODB
//process.env.TOKEN

mongoose.connect(process.env.MONGODB, {
}).then(()=> {
  console.log('connected to MongoDB');
}).catch((err) => {
  console.log(err);
});
client.start(process.env.TOKEN);