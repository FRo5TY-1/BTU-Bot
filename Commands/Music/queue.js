const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new Command({
  name: "queue",
  description: "🎵 See Queue",
  type: "SLASH",
  options: [
    {
      name: "page",
      description: "Page Number",
      type: "INTEGER",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const page = args[0] || 1;
    const end = page * 5;
    const start = end - 5;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
        content: "Music Is Not Being Played",
      });

    const tracks = queue.tracks.map((m, i) => {
      return `**${i + 1}.** [**\`${m.title}\`**](${m.url})`;
    });
    const prevTracks = queue.previousTracks.reverse().map((m, i) => {
      return `**${i + 1}.** [**\`${m.title}\`**](${m.url})`;
    });
    queue.previousTracks.reverse();

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Queue")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `Upcoming Tracks \`( Total: ${tracks.length} )\``,
          value: `${tracks.slice(start, end).join("\n") || "No Tracks"}`,
          inline: true,
        },
        {
          name: `Previous Tracks \`( Total: ${prevTracks.length} )\``,
          value: `${prevTracks.slice(start, end).join("\n") || "No Tracks"}`,
          inline: true,
        },
        {
          name: "Now Playing",
          value: `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setFooter({
        text: `Page: ${page}`,
        iconURL: "attachment://BTULogo.png",
      })
      .setColor("PURPLE")
      .setTimestamp();
    if (interaction.isCommand())
      return interaction.reply({ embeds: [embed], files: [Logo] });
    else if (interaction.isButton()) {
      return interaction.followUp({ embeds: [embed], files: [Logo] });
    }
  },
});
