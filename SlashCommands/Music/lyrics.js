const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = new SlashCommand({
  name: "lyrics",
  description: "🎵 Get Lyrics Of Current Song",

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
        content: "Music Is Not Being Played",
      });

    const songTitle = queue.current.title;
    let lyrics;

    try {
      lyrics = await lyricsFinder(songTitle, "");
      if (!lyrics) lyrics = `No lyrics found for ${songTitle}`;
    } catch (error) {
      lyrics = `No lyrics found for ${songTitle}`;
    }

    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`Lyrics For ${songTitle}`)
      .setDescription(lyrics)
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

    if (embed.description.length >= 2048)
      embed.description = `${embed.description.slice(0, 2045)}...`;

    return interaction.reply({ embeds: [embed] });
  },
});
