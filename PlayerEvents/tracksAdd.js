const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode, Queue, Track } = require("discord-player");

module.exports = new PlayerEvent(
  "tracksAdd",
  /**
   * @param {Queue} queue
   * @param {Array<Track>} tracks
   */ async (client, queue, tracks) => {
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
      .setTitle("Playlist Added")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**\`${tracks[0].playlist.title}\`**](${tracks[0].playlist.url}) - [**\`${tracks[0].playlist.author.name}\`**](${tracks[0].playlist.author.url})`
      )
      .setAuthor({
        name: tracks[0].requestedBy.username,
        iconURL: tracks[0].requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(tracks[0].playlist.thumbnail)
      .addFields(
        {
          name: "Possition",
          value: `\`\`\` ${queue.getTrackPosition(tracks[0]) + 1} \`\`\``,
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
