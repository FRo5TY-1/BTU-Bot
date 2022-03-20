const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "leave",
  description: "შეწყვიტეთ მუსიკა",
  type: "SLASH",

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("I Left <:FeelsBadMan:924601273028857866>")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    queue.destroy();
    return interaction.followUp({ embeds: [embed] });
  },
});
