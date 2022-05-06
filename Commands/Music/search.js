const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "search",
  description: "🎵 Search And Choose Music",
  type: "SLASH",
  options: [
    {
      name: "title",
      description: "Music Name",
      type: "STRING",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const songTitle = interaction.options.getString("title");

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: `You Must Be In A Voice Channel`,
      });

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.reply({ content: "Music Not Found!" });
    }

    const maxTracks = searchResult.tracks.slice(0, 10);

    const trackString = maxTracks
      .map((track, i) => `**${i + 1}**. [**\`${track.title}\`**](${track.url})`)
      .join("\n");

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Results For \` ${songTitle} \``)
      .setDescription(
        `${trackString} \`\`\`Type A Number From 1 To ${maxTracks.length}, or Type cancel To Cancel The Search!\`\`\``
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });

    const collector = interaction.channel.createMessageCollector({
      time: 20000,
      errors: ["time"],
      filter: (m) => m.author.id === interaction.user.id,
    });

    collector.on("collect", async (query) => {
      if (query.content.toLowerCase() === "cancel") {
        embed.setDescription(`${trackString} \`\`\`Search Canceled!\`\`\``);
        return (
          interaction.editReply({
            embeds: [embed],
          }) && collector.stop()
        );
      }

      const queue = player.createQueue(interaction.guild, {
        metadata: interaction.channel,
      });

      const value = parseInt(query.content);

      if (!value || value <= 0 || value > maxTracks.length) return;

      collector.stop();

      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);

      const track = searchResult.tracks[Number(query.content) - 1];

      queue.addTrack(track);

      if (!queue.playing) await queue.play();
    });

    collector.on("end", (msg, reason) => {
      if (reason === "time") {
        embed.setDescription(`${trackString} \`\`\`Time's Up!\`\`\``);
        return interaction.editReply({
          embeds: [embed],
        });
      }
    });
  },
});
