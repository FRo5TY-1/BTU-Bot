const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "next",
  description: "Next Song",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "Amount To Be Skipped",
      type: "INTEGER",
      required: false,
      minValue: 1,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });
    const amount = args[0] || 1;

    const loopMode =
      queue.repeatMode === QueueRepeatMode.TRACK
        ? "Song"
        : queue.repeatMode === QueueRepeatMode.QUEUE
        ? "Queue"
        : queue.repeatMode === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Current Song Skipped")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Filter",
          value: `\`\`\` ${
            !queue.getFiltersEnabled().length
              ? "OFF"
              : queue.getFiltersEnabled()
          } \`\`\``,
          inline: true,
        },
        {
          name: "Loop Mode",
          value: `\`\`\` ${loopMode} \`\`\``,
          inline: true,
        },
        {
          name: "Volume",
          value: `\`\`\` ${queue.volume} \`\`\``,
          inline: true,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    if (amount > 1) {
      queue.skipTo(amount);
      embed.setTitle(`Skipped \`${amount}\` Songs`);
      return interaction.followUp({ embeds: [embed], files: [Logo] });
    } else {
      queue.skip();
      return interaction.followUp({ embeds: [embed], files: [Logo] });
    }
  },
});
