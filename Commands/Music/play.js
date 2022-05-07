const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "play",
  description: "🎵 Play Music",
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

    const searchResult = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.reply({ content: "Music Not Found!" });
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
      leaveOnEmptyCooldown: 240000,
    });

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

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

    if (searchResult.playlist) {
      embed
        .setTitle("Playlist Added")
        .setDescription(
          `<a:CatJam:924585442450489404> | [**\`${searchResult.tracks[0].playlist.title}\`**](${searchResult.tracks[0].playlist.url}) - <@!${searchResult.tracks[0].requestedBy.id}>`
        );
    } else {
      embed
        .setTitle("Track Added")
        .setDescription(
          `<a:CatJam:924585442450489404> | [**\`${searchResult.tracks[0].title}\`**](${searchResult.tracks[0].url}) - <@!${searchResult.tracks[0].requestedBy.id}>`
        );
    }

    embed
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Possition",
          value: `\`\`\` ${
            queue.getTrackPosition(searchResult.tracks[0]) + 1
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
        },
        {
          name: "Now Playing",
          value: `<a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });

    if (!queue.playing) await queue.play();
  },
});
