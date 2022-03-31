const Command = require("../../Structures/Command.js");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "queue",
  description: "ნახეთ Queue / Playlist",
  type: "SLASH",
  options: [
    {
      name: "page",
      description: "გვერდი",
      type: "INTEGER",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const page = interaction.options.getInteger("page") || 1;
    const end = page * 10;
    const start = end - 10;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.followUp({
        content: "ამჟამად მუსიკა არაა ჩართული",
      });

    const previousTracks = queue.previousTracks.filter(function (v, i) {
      return i % 2 == 0;
    });
    const fullQueue = previousTracks
      .concat(queue.tracks)
      .slice(0, queue.tracks.length);
    const tracks = fullQueue.map((m, i) => {
      return `${i + 1}. [**${m.title}**](${m.url}) - <@!${m.requestedBy.id}>`;
    });

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Queue")
      .setDescription(`${tracks.slice(start, end).join("\n")}`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "Now Playing",
        value: `<a:CatJam:924585442450489404> | [**${queue.current.title}**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
      })
      .setFooter({
        text: `Page: ${page}, სულ ${tracks.length} მუსიკა`,
        iconURL: "attachment://BTULogo.png",
      })
      .setColor("PURPLE")
      .setTimestamp();

    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
