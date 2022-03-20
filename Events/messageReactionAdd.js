const Event = require("../Structures/Event.js");

module.exports = new Event(
  "messageReactionAdd",
  async (client, reaction, User) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (User.bot) return;

    upvotable_channel_list = ["925809120446148639", "940551819128614934"];

    if (upvotable_channel_list.includes(reaction.message.channel.id)) {
      const message = reaction.message;

      if (reaction.emoji.id === "940214247835721739") {
        message.reactions.resolve("940214273425170472").users.remove(User.id);
      }
      if (reaction.emoji.id === "940214273425170472") {
        message.reactions.resolve("940214247835721739").users.remove(User.id);
      }
    }
  }
);
