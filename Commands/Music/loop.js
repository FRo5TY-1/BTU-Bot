const Command = require("../../Structures/Command.js");
const { QueueRepeatMode } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "loop",
  description: "აამეორეთ მუსიკა ან Queue ან ჩართეთ AutoPlay",
  type: "SLASH",
  options: [
    {
      name: "type",
      description: "აირჩიეთ Loop-ის ტიპი",
      type: "INTEGER",
      required: true,
      choices: [
        {
          name: "Queue",
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: "Song",
          value: QueueRepeatMode.TRACK,
        },
        {
          name: "Autoplay",
          value: QueueRepeatMode.AUTOPLAY,
        },
        {
          name: "OFF",
          value: QueueRepeatMode.OFF,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    const mode = interaction.options.getInteger("type");
    const modeBefore = queue.repeatMode;
    const loopBefore = modeBefore === QueueRepeatMode.TRACK ? 'Song' : modeBefore === QueueRepeatMode.QUEUE ? 'Queue' : modeBefore === QueueRepeatMode.AUTOPLAY ? 'Autoplay' : 'OFF';

    queue.setRepeatMode(mode);

    const loopAfter = mode === QueueRepeatMode.TRACK ? 'Song' : mode === QueueRepeatMode.QUEUE ? 'Queue' : mode === QueueRepeatMode.AUTOPLAY ? 'Autoplay' : 'OFF';

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Loop Mode Changed")
      .setDescription(`From: \`${loopBefore}\`, To: \`${loopAfter}\``)
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
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    return interaction.followUp({ embeds: [embed] });
  },
});
