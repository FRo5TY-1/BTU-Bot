const Command = require("../../Structures/Command.js");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "forward-to",
  description: "გადაახვიეთ მუსიკა",
  type: "SLASH",
  options: [
    {
        name: "amount",
        description: "რომელ წამზე გადავიდე",
        type: "INTEGER",
        required: false,
    }
],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });
    
    const time = interaction.options.getInteger('amount') * 1000;

    queue.seek(time);

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp().current;

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
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
  },
});
