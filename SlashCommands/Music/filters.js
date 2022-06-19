const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const { filters } = require("../../Data/config.json");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "filters",
  description: "🎵 Apply Filters",
  options: [
    {
      name: "add",
      description: "🎵 Add A Filter",
      type: "SUB_COMMAND",
      options: [
        {
          name: "filter",
          description: "Filter To Add",
          type: "STRING",
          required: true,
          choices: filters,
        },
      ],
    },
    {
      name: "remove",
      description: "🎵 Remove A Filter",
      type: "SUB_COMMAND",
      options: [
        {
          name: "filter",
          description: "Filter To Remove",
          type: "STRING",
          required: true,
          choices: filters,
        },
      ],
    },
    {
      name: "clear",
      description: "🎵 Clear Enabled Filters",
      type: "SUB_COMMAND",
    },
  ],

  async run(interaction, args, client) {
    const player = client.player;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
        content: "Music Is Not Being Played",
      });

    if (
      interaction.user.id !== queue.current.requestedBy.id &&
      !interaction.member.roles.cache.some((r) => r.name === "DJ")
    ) {
      return interaction.reply({
        content:
          "Current Song Must Be Requested By You Or You Must Have DJ Role To Use This Command",
        ephemeral: true,
      });
    }

    const fullFilters = {};

    if (interaction.options.getSubcommand() === "add") {
      const filter = interaction.options.getString("filter");
      const filtersEnabled = queue.getFiltersEnabled();
      fullFilters[filter] = true;
      for (i = 0; i < filtersEnabled.length; i++) {
        fullFilters[filtersEnabled[i]] = true;
      }
      queue.setFilters(fullFilters);
    } else if (interaction.options.getSubcommand() === "remove") {
      const filter = interaction.options.getString("filter");
      const filtersEnabled = queue.getFiltersEnabled();
      for (i = 0; i < filtersEnabled.length; i++) {
        fullFilters[filtersEnabled[i]] = true;
      }
      fullFilters[filter] = false;
      queue.setFilters(fullFilters);
    } else if (interaction.options.getSubcommand() === "clear") {
      queue.setFilters({ nightcore: false });
    }

    const filtersEnabled = !queue.getFiltersEnabled().length
      ? "None"
      : queue.getFiltersEnabled().join(" ");

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Filters Changed`)
      .setDescription(`**\`\`\`Enabled Filters: ( ${filtersEnabled} )\`\`\`**`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields({
        name: "Now Playing",
        value: `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
