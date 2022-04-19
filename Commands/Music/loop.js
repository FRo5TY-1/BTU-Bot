const Command = require("../../Structures/Command.js");
const { QueueRepeatMode } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "loop",
  description: "Loop The Playlist",
  type: "SLASH",
  options: [
    {
      name: "type",
      description: "Choose Loop Type",
      type: "INTEGER",
      required: true,
      choices: [
        {
          name: "Queue",
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: "Song",
          value: QueueRepeatMode.TRACK,
        },
        {
          name: "Autoplay",
          value: QueueRepeatMode.AUTOPLAY,
        },
        {
          name: "OFF",
          value: QueueRepeatMode.OFF,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });

    const mode = interaction.options.getInteger("type");
    const modeBefore = queue.repeatMode;
    const loopBefore =
      modeBefore === QueueRepeatMode.TRACK
        ? "Song"
        : modeBefore === QueueRepeatMode.QUEUE
        ? "Queue"
        : modeBefore === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";

    queue.setRepeatMode(mode);

    const loopAfter =
      mode === QueueRepeatMode.TRACK
        ? "Song"
        : mode === QueueRepeatMode.QUEUE
        ? "Queue"
        : mode === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Loop Mode Changed")
      .setDescription(`From: \`${loopBefore}\`, To: \`${loopAfter}\``)
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "Now Playing",
        value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
