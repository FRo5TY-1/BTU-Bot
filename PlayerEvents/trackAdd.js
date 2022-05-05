const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode, Queue, Track } = require("discord-player");

module.exports = new PlayerEvent(
  "trackAdd",
  /**
   * @param {Queue} queue
   * @param {Track} track
   */ async (client, queue, track) => {
    if (queue.current === track) return;
    if (queue.previousTracks.includes(track)) return;
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
      .setTitle("Track Added")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**\`${track.title}\`**](${track.url}) - <@!${track.requestedBy.id}>`
      )
      .setAuthor({
        name: track.requestedBy.username,
        iconURL: track.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Possition",
          value: `\`\`\` ${queue.getTrackPosition(track) + 1} \`\`\``,
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
          value: `<a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    queue.metadata.send({ embeds: [embed], files: [Logo] });
  }
);
