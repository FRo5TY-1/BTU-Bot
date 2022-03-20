const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "now-playing",
  description: "ინფორმაცია მიმდინარე მუსიკაზე",
  type: "SLASH",

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Now Playing")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
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
