const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = new Command({
  name: "pause",
  description: "Pause Music",
  type: "SLASH",

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });

    const progress = queue.createProgressBar();

    const loopMode =
      queue.repeatMode === QueueRepeatMode.TRACK
        ? "Song"
        : queue.repeatMode === QueueRepeatMode.QUEUE
        ? "Queue"
        : queue.repeatMode === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";

    const previousTracks = queue.previousTracks.filter(function (v, i) {
      return i % 2 == 0;
    });

    const fullQueue = previousTracks
      .concat(queue.tracks)
      .slice(0, queue.tracks.length);

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Paused")
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
        },
        {
          name: "⠀",
          value: progress,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    queue.setPaused(true);
    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
