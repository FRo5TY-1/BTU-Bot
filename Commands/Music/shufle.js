const Command = require("../../Structures/Command.js");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "shuffle",
  description: "Shuffle Queue",
  type: "SLASH",

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    queue.shuffle();

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Queue Shuffled")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
          {
              name: "Now Playing",
              value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
          },
        {
          name: "⠀",
          value: progress,
        }
      )
      .setColor("PURPLE")
      .setThumbnail(queue.current.thumbnail)
      .setFooter({ text: "BTU ", iconURL: 'https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png' })
      .setTimestamp();

    return interaction.followUp({ embeds: [embed] });
  },
});
