const SlashCommand = require("../../Structures/SlashCommand.js");
const { QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "loop",
  description: "🎵 Loop The Playlist",
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

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
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
        value: `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
