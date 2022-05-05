const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "coinflip",
  description: "Flip A Coin",
  type: "SLASH",

  async run(interaction) {
    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const coins = ["Heads", "Tails"];
    const coin = coins[Math.floor(Math.random() * 2)];
    embed
      .setTitle("Flipped coin is...")
      .setDescription(`**${coin}**`)
      .setColor("PURPLE")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: "BTU ",
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
