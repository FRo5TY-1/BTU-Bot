const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "jump-to",
  description: "🎵 Jump To A Given Index (Won't Skip Every Song In It's Path)",
  type: "SLASH",
  options: [
    {
      name: "index",
      description:
        "Song Index In Queue (Use Negative(-) Number For Previous Song)",
      type: "INTEGER",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
        content: "Music Is Not Being Played",
      });

    if (
      interaction.user.id !== queue.current.requestedBy.id &&
      !interaction.member.roles.cache.some((r) => r.name === "DJ")
    ) {
      return interaction.reply({
        content:
          "Current Song Must Be Requested By You Or You Must Have DJ Role To Use This Command",
        ephemeral: true,
      });
    }

    let index = interaction.options.getInteger("index") || 1;

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
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({
          dynamic: true,
        }),
      })
      .addFields(
        {
          name: "Filters",
          value: `\`\`\` ${
            !queue.getFiltersEnabled().length
              ? "None"
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
        },
        {
          name: "Skipped Track",
          value: `[**\`${queue.current.title}\`**](${queue.current.url})`,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    if (index > 0) {
      if (index > queue.tracks.length) index = queue.tracks.length - 1;
      else index -= 1;
      queue.jump(index);
      embed.setTitle(`Jumped To Song With Index Of \`${index + 1}\``);
      return interaction.reply({ embeds: [embed], files: [Logo] });
    } else if (index < 0) {
      if (queue.previousTracks.length < 1)
        return interaction.reply({ content: "No Previous Tracks" });
      let posIndex = Math.abs(index) - 1;
      if (posIndex > queue.previousTracks.length - 1)
        posIndex = queue.previousTracks.length - 1;
      const track =
        queue.previousTracks.slice(posIndex, posIndex + 1) ||
        queue.previousTracks.slice(-2, -1);
      queue.insert(track[0], 0);
      queue.skip();
      embed.setTitle(
        `Jumped To Previous Song With Index Of \`${posIndex + 1}\``
      );
      return interaction.reply({ embeds: [embed], files: [Logo] });
    } else {
      embed.setTitle(`Jumped To Song With Index Of \`${index + 1}\``);
      queue.jump(index);
      return interaction.reply({ embeds: [embed], files: [Logo] });
    }
  },
});
