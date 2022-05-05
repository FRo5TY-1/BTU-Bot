const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "skip-to",
  description: "Skip To A Given Index",
  type: "SLASH",
  options: [
    {
      name: "index",
      description:
        "Song Index In Queue (Use Negative(-) Number For Previous Song)",
      type: "INTEGER",
      required: false,
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
      interaction.user.id !== queue.current.requestedBy.id ||
      !interaction.member.roles.cache.some((r) => r.name === "DJ")
    ) {
      return interaction.reply({
        content:
          "Current Song Must Be Requested By You Or You Must Have DJ Role To Use This Command",
        ephemeral: true,
      });
    }

    let index = interaction.options.getInteger("index") || 1;

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
      .setDescription(
        `<a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({
          dynamic: true,
        }),
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
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    if (index - 1 > 0) {
      if (index - 1 > queue.tracks.length) {
        return interaction.reply({
          content: `There Is No Song With \`${index}\` Index`,
        });
      }

      queue.jump(index - 1);

      embed.setTitle(`Skipped To Song With Index Of \`${index}\``);
      return interaction.reply({ embeds: [embed], files: [Logo] });
    } else if (index < 0) {
      const posIndex = Math.abs(index);
      if (posIndex > queue.previousTracks.length)
        return interaction.reply({
          content: `There Is No Previous Song With \`${posIndex}\` Index`,
        });
      const track =
        queue.previousTracks.slice(index, -1)[0] ||
        queue.previousTracks.slice(index)[0];
      queue.previousTracks.splice(index, 1);
      queue.insert(track, 0);
      queue.skip();
      embed.setTitle(`Skipped To Previous Song With Index Of \`${posIndex}\``);
      return interaction.reply({ embeds: [embed], files: [Logo] });
    } else {
      embed.setTitle("Skipped `1` Song");
      queue.skip();
      return interaction.reply({ embeds: [embed], files: [Logo] });
    }
  },
});
