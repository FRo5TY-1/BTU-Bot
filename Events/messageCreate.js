const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const channelModel = require("../DBModels/upvoteChannelsSchema.js");

module.exports = new Event(
  "messageCreate",
  /**
   * @param {Discord.Message} message
   */
  async (client, message) => {
    if (message.channel.type == "dm") return;

    const channelIdArray = (
      await channelModel.find({
        guildid: message.guildId,
      })
    ).map((i) => i.channelId);

    if (channelIdArray.includes(message.channel.id)) {
      message.react("<:upvote:940214247835721739>");
      message.react("<:downvote:940214273425170472>");
    }
  }
);
