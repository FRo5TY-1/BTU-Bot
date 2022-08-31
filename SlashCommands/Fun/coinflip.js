const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "coinflip",
  description: "Flip A Coin",

  async run(interaction) {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const coin = Math.random() > 0.5 ? "Heads" : "Tails";
    const coinPng = new Discord.MessageAttachment(`./Assets/Coins/${coin}.png`);
    embed
      .setTitle("Flipped coin is...")
      .setDescription(`**${coin}**`)
      .setColor("PURPLE")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setImage(`attachment://${coin}.png`)
      .setFooter({
        text: "BTU ",
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo, coinPng] });
  },
});
