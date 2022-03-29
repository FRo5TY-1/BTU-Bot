const Command = require("../../Structures/Command.js");
const player = require("../../Structures/Player");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = new Command({
  name: "shuffle",
  description: "Shuffle Queue",
  type: "SLASH",

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    queue.shuffle();

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

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Queue Shuffled")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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
          name: "Now Playing",
          value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    return interaction.followUp({ embeds: [embed] });
  },
});
