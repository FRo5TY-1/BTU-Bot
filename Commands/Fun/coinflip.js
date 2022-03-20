const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "coinflip",
  description: "ააგდეთ მონეტა",
  aliases: ["cf", "flip"],
  type: "BOTH",

  async run(message) {
    const file = new Discord.MessageAttachment("Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const coins = ["Heads", "Tails"];
    const coin = coins[Math.floor(Math.random() * 2)];
    embed
      .setTitle("Flipped coin is...")
      .setDescription(`**${coin}**`)
      .setColor("PURPLE")
      .setThumbnail("attachment://BTULogo.png")
      .setTimestamp();

    if (message.isCommand) {
      embed.setAuthor({
        name: message.user.username,
        iconURL: message.user.displayAvatarURL({ dynamic: true }),
      });

      message.followUp({ embeds: [embed], files: [file] });
    } else {
      embed.setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      message.reply({ embeds: [embed], files: [file] });
    }
  },
});
