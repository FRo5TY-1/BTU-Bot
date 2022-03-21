const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
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

    if (!interaction.member.voice.channel)
      return interaction.followUp({
        content: "ბრძანების გამოსაყენებლად უნდა იყოთ voice channel-ში",
        ephemeral: true,
      });

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.followUp({ content: "მუსიკა ვერ მოიძებნა!" });
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    const maxTracks = searchResult.tracks.slice(0, 10);

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Results For ${songTitle}`)
      .setDescription(
        `${maxTracks
          .map((track, i) => `**${i + 1}**. [**${track.title}**](${track.url})`)
          .join("\n")}`
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `აირჩიეთ მუსიკა **1-დან** **${maxTracks.length}-მდე** ან დაწერეთ **cancel** რომ გააუქმოთ ძებნა! ⬇️`,
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
      if (query.content.toLowerCase() === "cancel")
        return (
          interaction.editReply({ content: `ძებნა გაუქმდა!`, embeds: [] }) &&
          collector.stop()
        );

      const value = parseInt(query.content);

      if (!value || value <= 0 || value > maxTracks.length) return;

      collector.stop();

      if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

      const track = searchResult.tracks[Number(query.content) - 1];

      queue.addTrack(track);

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
            name: "Possition In Queue",
            value: `${queue.getTrackPosition(track) + 1}`,
          },
          {
            name: "Now Playing",
            value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
          }
        )
        .setColor("PURPLE")
        .setThumbnail(track.thumbnail)
        .setFooter({
          text: "BTU ",
          iconURL:
            "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
        })
        .setTimestamp();

        interaction.editReply({ embeds: [embed] })

      if (!queue.playing) await queue.play();
    });

    collector.on("end", (msg, reason) => {
      if (reason === "time")
        return interaction.editReply({
          content: "არჩევის დრო გავიდა!",
          embeds: [embed],
        });
    });
  },
});
