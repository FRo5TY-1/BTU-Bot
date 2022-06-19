const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const { PotFriend } = require("../Data/emojis.json");

module.exports = new Event(
  "guildMemberAdd",
  /** @param {Discord.GuildMember} member */ (client, member) => {
    const unverifiedRole = member.guild.roles.cache.find(
      (r) => r.name === "Unverified"
    );
    if (unverifiedRole) member.roles.add(unverifiedRole);
  }
);
