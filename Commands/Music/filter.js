const Command = require("../../Structures/Command.js");
const { QueryType, QueueRepeatMode } = require("discord-player");
const player = require("../../Structures/Player");
const Discord = require("discord.js");

module.exports = new Command({
  name: "filter",
  description: "Apply A Filter",
  type: "SLASH",
  options: [
    {
      name: "type",
      description: "Choose A Filter",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "NightCore",
          value: "NightCore",
        },
        {
          name: "8D",
          value: "8D",
        },
        {
          name: "BassBoost Low",
          value: "BassBoost Low",
        },
        {
          name: "BassBoost Medium",
          value: "BassBoost Medium",
        },
        {
          name: "BassBoost High",
          value: "BassBoost High",
        },
        {
          name: "Surrounding",
          value: "Surrounding",
        },
        {
          name: "Karaoke",
          value: "Karaoke",
        },
        {
          name: "Mono",
          value: "Mono",
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
        content: "Music Is Not Being Played",
      });

    const mode = interaction.options.getString("type");

    const filterBefore = !queue.getFiltersEnabled().length
      ? "OFF"
      : queue.getFiltersEnabled();

    if (mode === "NightCore") {
      queue.setFilters({
        nightcore: true,
      });
    } else if (mode === "BassBoost Low") {
      queue.setFilters({
        bassboost_low: true,
      });
    } else if (mode === "BassBoost Low") {
      queue.setFilters({
        bassboost_low: true,
      });
    } else if (mode === "BassBoost Medium") {
      queue.setFilters({
        bassboost: true,
      });
    } else if (mode === "BassBoost High") {
      queue.setFilters({
        bassboost_high: true,
      });
    } else if (mode === "Karaoke") {
      queue.setFilters({
        karaoke: true,
      });
    } else if (mode === "Mono") {
      queue.setFilters({
        mono: true,
      });
    } else if (mode === "8D") {
      queue.setFilters({
        "8D": true,
      });
    } else if (mode === "Surrounding") {
      queue.setFilters({
        surrounding: true,
      });
    } else if (mode === "OFF") {
      queue.setFilters({
        nightcore: false,
      });
    }

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Filter Changed")
      .setDescription(`From: \` ${filterBefore} \`, To: \` ${mode} \``)
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

    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
