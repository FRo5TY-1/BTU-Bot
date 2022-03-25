const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "skip",
  description: "გამოტოვეთ მუსიკა",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "რამდენი მუსიკა გამოვტოვო",
      type: "INTEGER",
      required: false,
      minValue: 1,
    },
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });
    const amount = interaction.options.getInteger("amount") || 1;

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Current Song Skipped")
      .setDescription(
        `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "⠀",
        value: progress,
      })
      .setColor("PURPLE")
      .setThumbnail(queue.current.thumbnail)
      .setFooter({
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    if (amount > 1) {
      queue.skipTo(amount);
      embed.setTitle(`Skipped \`${amount}\` Songs`);
      return interaction.followUp({ embeds: [embed] });
    } else {
      queue.skip();
      return interaction.followUp({ embeds: [embed] });
    }
  },
});
