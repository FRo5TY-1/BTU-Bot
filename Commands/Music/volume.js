const Command = require("../../Structures/Command.js");
const { QueryType } = require("discord-player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "volume",
  description: "Change Volume",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "Number From 1 To 200",
      type: "INTEGER",
      required: true,
      maxValue: 200,
      minValue: 1,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
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
        value: `<a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
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
