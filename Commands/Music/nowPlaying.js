const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new Command({
  name: "now-playing",
  description: "🎵 Check Current Song",
  type: "SLASH",

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
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
      .setTitle("Now Playing")
      .setDescription(
        `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: " Filters Enabled ",
          value: `\`\`\` ${
            !queue.getFiltersEnabled().length
              ? "None"
              : queue.getFiltersEnabled()
          } \`\`\``,
          inline: false,
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

    return interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
