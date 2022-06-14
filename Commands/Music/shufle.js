const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new Command({
  name: "shuffle",
  description: "🎵 Shuffle Queue",
  type: "SLASH",

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

    queue.shuffle();

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
      .setTitle("Queue Shuffled")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
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
          value: `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    if (interaction.isApplicationCommand())
      return interaction.reply({ embeds: [embed], files: [Logo] });
    else return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
