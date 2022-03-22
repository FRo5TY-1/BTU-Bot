const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "coinflip",
  description: "ააგდეთ მონეტა",
  type: "SLASH",

  async run(interaction) {
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
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });
  },
});
