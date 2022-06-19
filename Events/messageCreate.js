const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const channelModel = require("../DBModels/upvoteChannelsSchema.js");
const { UpVote, DownVote } = require("../Data/emojis.json");

module.exports = new Event(
  "messageCreate",
  /**
   * @param {Discord.Message} message
   */
  async (client, message) => {
    if (message?.channel.type == "dm") return;

    if (message?.channel.name === "✅verify" && !message.flags.has(64))
      message?.delete();

    const channelIdArray = (
      await channelModel.find({
        guildid: message.guildId,
      })
    ).map((i) => i.channelId);

    if (channelIdArray.includes(message.channel.id)) {
      message.react(UpVote.emoji);
      message.react(DownVote.emoji);
    }
  }
);
