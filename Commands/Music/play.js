const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "play",
  description: "მუსიკის დასაკვრელად",
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
        return interaction.followUp({ content: 'მუსიკა ვერ მოიძებნა!' })
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Song Added")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**${searchResult.tracks[0].title}**](${searchResult.tracks[0].url}) - <@!${interaction.user.id}>`
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Possition In Queue",
          value: `${queue.getTrackPosition(searchResult.tracks[0]) + 1}`,
        },
        {
          name: "Now Playing",
          value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setColor("PURPLE")
      .setThumbnail(searchResult.tracks[0].thumbnail)
      .setFooter({ text: "BTU ", iconURL: 'https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png' })
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });

    if (!queue.playing) await queue.play();
  },
});
