const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const { WelcomeMessage } = require("../Database/index");

module.exports = new Event(
  "guildMemberAdd",
  /** @param {Discord.GuildMember} member */ (client, member) => {
    const data = WelcomeMessage.findOne({ guildId: member.guild?.id }).then(
      (data) => {
        const channel = member.guild.channels.cache.get(data.channelId);
        return channel
          .send({ content: data.message })
          .catch((err) => console.log("Couldn't Send Message"));
      }
    );
  }
);
