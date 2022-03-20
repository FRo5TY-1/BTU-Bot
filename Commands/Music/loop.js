const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
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
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Queue",
          value: "QUEUE",
        },
        {
          name: "Song",
          value: "TRACK",
        },
        {
          name: "Autoplay",
          value: "AUTOPLAY",
        },
        {
          name: "OFF",
          value: "OFF",
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

    const mode = interaction.options.getString("type");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Loop Mode Changed")
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

    if (mode === 'QUEUE') {
      embed.setDescription(`Loop Mode: **Queue**`);
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
    } else if (mode === "TRACK") {
      embed.setDescription(`Loop Mode: **Song**`);
      queue.setRepeatMode(QueueRepeatMode.TRACK);
    } else if (mode === "AUTOPLAY") {
      embed.setDescription(`Loop Mode: **Autoplay**`);
      queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
    } else if (mode === "OFF") {
      embed.setDescription(`Loop Mode: **OFF**`);
      queue.setRepeatMode(QueueRepeatMode.OFF);
    }
    return interaction.followUp({ embeds: [embed] });
  },
});
