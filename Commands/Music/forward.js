const Command = require("../../Structures/Command.js");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "forward",
  description: "Seek To Given Time",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "Which Second To Seek",
      type: "INTEGER",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });

    const time = interaction.options.getInteger("amount") * 1000;
    percBefore = queue.getPlayerTimestamp().current;

    queue.seek(time);

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp().current;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Forwarded")
      .setDescription(`From: \`${percBefore}\`, To: \`${perc}\``)
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "⠀",
        value: progress,
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
