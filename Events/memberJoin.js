const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const { PotFriend } = require("../Data/emojis.json");

module.exports = new Event(
  "guildMemberAdd",
  /** @param {Discord.GuildMember} member */ (client, member) => {}
);
