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
  if (
    queue.repeatMode === QueueRepeatMode.QUEUE ||
    queue.repeatMode === QueueRepeatMode.TRACK
  )
    return;
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle("Started Playing")
    .setDescription(`🎶 | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`)
    .setAuthor({
      name: queue.current.requestedBy.username,
      iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
    })
    .setColor("PURPLE")
    .setThumbnail(queue.current.thumbnail)
    .setFooter({
      text: "BTU ",
      iconURL:
        "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
    })
    .setTimestamp();
  queue.metadata.send({ embeds: [embed] });
});

module.exports = player;
