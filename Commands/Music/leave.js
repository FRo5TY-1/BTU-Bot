const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "leave",
  description: "Stop Playing Music",
  type: "SLASH",

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription("✅ | `I Destroyed The Queue And Left The Channel`")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    queue.destroy();
    setTimeout(() => {
      return interaction.followUp({ embeds: [embed], files: [Logo] });
    }, 500);
  },
});
