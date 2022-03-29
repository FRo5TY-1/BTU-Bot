const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "search",
  description: "მოძებნეთ და აირჩიეთ მუსიკა",
  type: "SLASH",
  options: [
    {
      name: "title",
      description: "მიუთითეთ მუსიკის სახელი",
      type: "STRING",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    const songTitle = interaction.options.getString("title");

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.followUp({ content: "მუსიკა ვერ მოიძებნა!" });
    }

    const maxTracks = searchResult.tracks.slice(0, 10);

    const trackString = maxTracks
      .map((track, i) => `**${i + 1}**. [**${track.title}**](${track.url})`)
      .join("\n");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Results For \` ${songTitle} \``)
      .setDescription(
        `${trackString} \`\`\`აირჩიეთ მუსიკა 1-დან ${maxTracks.length}-მდე ან დაწერეთ cancel რომ გააუქმოთ ძებნა!\`\`\``
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });

    const collector = interaction.channel.createMessageCollector({
      time: 20000,
      errors: ["time"],
      filter: (m) => m.author.id === interaction.user.id,
    });

    collector.on("collect", async (query) => {
      if (query.content.toLowerCase() === "cancel") {
        embed.setDescription(`${trackString} \`\`\`ძებნა გაუქმდა!\`\`\``);
        return (
          interaction.editReply({
            embeds: [embed],
          }) && collector.stop()
        );
      }

      if (!interaction.member.voice.channel)
        return (
          interaction.editReply({
            content: `თქვენ უნდა იყოთ Voice Channel-ში`,
            embeds: [],
          }) && collector.stop()
        );

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

      const loopMode =
        queue.repeatMode === QueueRepeatMode.TRACK
          ? "Song"
          : queue.repeatMode === QueueRepeatMode.QUEUE
          ? "Queue"
          : queue.repeatMode === QueueRepeatMode.AUTOPLAY
          ? "Autoplay"
          : "OFF";

      embed
        .setTitle("Song Added")
        .setDescription(
          `<a:CatJam:924585442450489404> | [**${track.title}**](${track.url}) - <@!${interaction.user.id}>`
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Possition",
            value: `\`\`\` ${queue.getTrackPosition(track) + 1} \`\`\``,
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
            value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
          }
        )
        .setColor("PURPLE")
        .setImage(track.thumbnail)
        .setFooter({
          text: "BTU ",
          iconURL:
            "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
        })
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });

      if (!queue.playing) await queue.play();
    });

    collector.on("end", (msg, reason) => {
      if (reason === "time") {
        embed.setDescription(`${trackString} \`\`\`არჩევის დრო გავიდა!\`\`\``);
        return interaction.editReply({
          embeds: [embed],
        });
      }
    });
  },
});
