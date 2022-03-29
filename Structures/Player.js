const { Player, QueueRepeatMode } = require("discord-player");
const Client = require("./Client");
const client = new Client();
const Discord = require("discord.js");

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("trackStart", (queue, track) => {
  if (queue.repeatMode === QueueRepeatMode.TRACK) return;

  const loopMode =
    queue.repeatMode === QueueRepeatMode.TRACK
      ? "Song"
      : queue.repeatMode === QueueRepeatMode.QUEUE
      ? "Queue"
      : queue.repeatMode === QueueRepeatMode.AUTOPLAY
      ? "Autoplay"
      : "OFF";

  const embed = new Discord.MessageEmbed();
  embed
    .setTitle("Now Playing")
    .setDescription(
      ` 📀 | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
    )
    .setAuthor({
      name: queue.current.requestedBy.username,
      iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
    })
    .addFields(
      {
        name: "Filter",
        value: `\`\`\` ${
          !queue.getFiltersEnabled().length ? "OFF" : queue.getFiltersEnabled()
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
      text: "BTU ",
      iconURL:
        "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
    })
    .setImage(queue.current.thumbnail)
    .setTimestamp();
  queue.metadata.send({ embeds: [embed] });
});

module.exports = player;
