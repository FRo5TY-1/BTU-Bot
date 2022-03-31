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
    },
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });
    const amount = interaction.options.getInteger("amount");

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
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
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    queue.setVolume(amount);

    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
