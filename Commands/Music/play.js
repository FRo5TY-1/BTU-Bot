const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "play",
  description: "Play Music",
  type: "SLASH",
  options: [
    {
      name: "title",
      description: "Music Name / Link",
      type: "STRING",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const songTitle = interaction.options.getString("title");

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Must Be In Voice Channel To Play Music",
        ephemeral: true,
      });

    await interaction.deferReply();

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.reply({ content: "Music Not Found!" });
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    await interaction.deleteReply();

    if (!queue.playing) await queue.play();
  },
});
