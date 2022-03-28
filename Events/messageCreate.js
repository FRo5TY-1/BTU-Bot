const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event("messageCreate", async (client, message) => {
  if (message.author.bot || message.channel.type == "dm") return;

  ignored_channel_list = ["940551819128614934"];

  upvotable_channel_list = ["940551819128614934"];

  if (upvotable_channel_list.includes(message.channel.id)) {
    message.react("<:upvote:940214247835721739>");
    message.react("<:downvote:940214273425170472>");
  }
});
