const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "volume",
  description: "შეცვალეთ ხმის მოცულობა",
  type: "SLASH",
  options: [
      {
          name: "amount",
          description: "ხმის მოცულობა",
          type: "INTEGER",
          required: true,
          maxValue: 200,
          minValue: 1,
      }
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });
    const amount = interaction.options.getInteger('amount');

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Volume Changed")
      .setDescription(`From: \`${queue.volume}\`, To: \`${amount}\``)
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "Now Playing",
        value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
      })
      .setColor("PURPLE")
      .setThumbnail(queue.current.thumbnail)
      .setFooter({
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

      queue.setVolume(amount);

      return interaction.followUp({ embeds: [embed] });
  },
});
