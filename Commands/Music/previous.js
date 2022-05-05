const Command = require("../../Structures/Command.js");
const { QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "previous",
  description: "Previous Song",
  type: "SLASH",

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

    const loopMode =
      queue.repeatMode === QueueRepeatMode.TRACK
        ? "Song"
        : queue.repeatMode === QueueRepeatMode.QUEUE
        ? "Queue"
        : queue.repeatMode === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";

    const currentTrack = queue.current;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Current Song Skipped")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**\`${currentTrack.title}\`**](${currentTrack.url}) - <@!${currentTrack.requestedBy.id}>`
      )
      .setAuthor({
        name: currentTrack.requestedBy.username,
        iconURL: currentTrack.requestedBy.displayAvatarURL({ dynamic: true }),
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

    if (queue.previousTracks.length < 1) queue.seek(0);
    else {
      queue.insert(queue.previousTracks.slice(-1)[0], 0);
      queue.insert(currentTrack, 1);
      queue.skip();
      setTimeout(() => {
        queue.previousTracks.pop();
      }, 500);
      if (interaction.isButton) return;
      return interaction.reply({ embeds: [embed], files: [Logo] });
    }
  },
});
