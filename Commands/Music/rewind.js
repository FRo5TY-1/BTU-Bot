const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "rewind",
  description: "Rewind Music",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "How Many Seconds To Rewind",
      type: "INTEGER",
      required: true,
      minValue: 5,
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "Music Is Not Being Played",
      });

    const percBefore = queue.getPlayerTimestamp().current;
    const time = interaction.options.getInteger("amount");
    const timeStamp = queue.getPlayerTimestamp().current.split(":");
    const seekTime = timeStamp[0] * 60000 + timeStamp[1] * 1000 - time * 1000;

    if (seekTime < 0) queue.seek(0);
    else queue.seek(seekTime);

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp().current;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Rewinded \` ${time} \` Seconds `)
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
