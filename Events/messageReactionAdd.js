const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const channelModel = require("../DBModels/upvoteChannelsSchema.js");
const {UpVote, DownVote} = require("../Data/emojis.json")

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

      if (reaction.emoji.id === UpVote.id) {
        message.reactions.resolve(DownVote.id).users.remove(User.id);
      }
      if (reaction.emoji.id === DownVote.id) {
        message.reactions.resolve(UpVote.id).users.remove(User.id);
      }
    }
  }
);
