const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const Client = require("../Structures/Client.js");
const channelModel = require("../DBModels/upvoteChannelsSchema.js");

module.exports = new Event(
  "messageReactionAdd",
  /**
   *
   * @param {Discord.MessageReaction} reaction
   * @param {Discord.User} User
   * @returns
   */
  async (client, reaction, User) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (User.bot) return;

    const channelIdArray = (
      await channelModel.find({
        guildid: reaction.message.guildId,
      })
    ).map((i) => i.channelId);

    if (channelIdArray.includes(reaction.message.channel.id)) {
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
