const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
// const profileModel = require("../DBModels/profileSchema.js");

module.exports = new Event("messageCreate", async (client, message) => {
  if (message.author.bot || message.channel.type == "dm") return;

  ignored_channel_list = ["940551819128614934"];

  upvotable_channel_list = ["940551819128614934"];

  if (upvotable_channel_list.includes(message.channel.id)) {
    message.react("<:upvote:940214247835721739>");
    message.react("<:downvote:940214273425170472>");
  }

  // if (ignored_channel_list.includes(message.channel.id)) return;

  // if (!message.content.startsWith(client.prefix)) return;

  // const args = message.content.substring(client.prefix.length).split(/ +/);
  // const cmd = args.shift().toLowerCase();
  // const command =
  //   client.commands.get(cmd) ||
  //   client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

  // if (!command) return message.reply(`ეს ბრძანება არ არსებობს! 👉 ${cmd}`);

  // if (!["BOTH", "TEXT"].includes(command.type))
  //   return message.reply({
  //     content: "this is slash command only",
  //     ephemeral: true,
  //   });

  // const validPermissions = [
  //   "CREATE_INSTANT_INVITE",
  //   "KICK_MEMBERS",
  //   "BAN_MEMBERS",
  //   "ADMINISTRATOR",
  //   "MANAGE_CHANNELS",
  //   "MANAGE_GUILD",
  //   "ADD_REACTIONS",
  //   "VIEW_AUDIT_LOG",
  //   "PRIORITY_SPEAKER",
  //   "STREAM",
  //   "VIEW_CHANNEL",
  //   "SEND_MESSAGES",
  //   "SEND_TTS_MESSAGES",
  //   "MANAGE_MESSAGES",
  //   "EMBED_LINKS",
  //   "ATTACH_FILES",
  //   "READ_MESSAGE_HISTORY",
  //   "MENTION_EVERYONE",
  //   "USE_EXTERNAL_EMOJIS",
  //   "VIEW_GUILD_INSIGHTS",
  //   "CONNECT",
  //   "SPEAK",
  //   "MUTE_MEMBERS",
  //   "DEAFEN_MEMBERS",
  //   "MOVE_MEMBERS",
  //   "USE_VAD",
  //   "CHANGE_NICKNAME",
  //   "MANAGE_NICKNAMES",
  //   "MANAGE_ROLES",
  //   "MANAGE_WEBHOOKS",
  //   "MANAGE_EMOJIS",
  // ];

  // if (command.permissions) {
  //   let invalidPerms = [];
  //   for (const perm of command.permissions) {
  //     if (!message.member.permissions.has(perm)) {
  //       invalidPerms.push(perm);
  //     }
  //   }
  //   if (invalidPerms.length != 0) {
  //     return message.channel.send(
  //       "თქვენ არ გაქვთ ამ ბრძანების გამოყენების უფლება"
  //     );
  //   }
  // }
  // args.slice(0)
  // command.run(message, args, client);
});
