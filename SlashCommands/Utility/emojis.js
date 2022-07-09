const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "emoji",
  description: "Get A List Of Server Emojis",
  options: [
    {
      type: "SUB_COMMAND",
      name: "single",
      description: "Get Emoji By Name",
      options: [
        {
          type: "STRING",
          name: "name",
          description: "Get Information On Specific Emoji",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "guild",
      description: "Get Guild Emojis",
      options: [
        {
          type: "STRING",
          name: "guild",
          description: "Guild Name Or ID (Bot Has To Be In That Server)",
          required: false,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");

    if (interaction.options.getSubcommand() === "guild") {
      let guild = interaction.guild;

      const guildName = interaction.options.getString("guild");
      if (guildName) {
        guild =
          client.guilds.cache.get(guildName) ||
          client.guilds.cache.find(
            (g) => g.name.toLowerCase() == guildName.toLowerCase()
          );
      }

      if (!guild)
        return interaction.reply({
          content: "Guild Not Found!",
          ephemeral: true,
        });

      const static = guild.emojis.cache.filter((e) => !e.animated);
      const animated = guild.emojis.cache.filter((e) => e.animated);

      const emojis = static
        .map((e) => {
          return `<:${e.name}:${e.id}>`;
        })
        .concat(
          animated.map((e) => {
            return `<a:${e.name}:${e.id}>`;
          })
        );
      const embed = new Discord.MessageEmbed();
      embed
        .setColor("PURPLE")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `**\`\`\`Server Emojis -> | ${static.size} Static | ${
            animated.size
          } Animated | Total ${emojis.length} | \`\`\`\n${emojis
            .slice(0, 50)
            .join(" ")}**`
        )
        .setFooter({
          text: `BTU `,
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      const embeds = [embed];

      const chunkSize = 50;
      for (let i = 50; i < emojis.length; i += chunkSize) {
        const chunk = emojis.slice(i, i + chunkSize);
        embeds.push(
          new Discord.MessageEmbed()
            .setDescription(`**${chunk.join(" ")}**`)
            .setColor("PURPLE")
        );
      }

      return interaction.reply({ embeds: embeds, files: [Logo] });
    } else {
      const emojiName = interaction.options.getString("name") || null;

      const embed = new Discord.MessageEmbed();

      const cachedEmoji = interaction.guild.emojis.cache.find(
        (e) => e.name.toLowerCase() === emojiName.toLowerCase()
      );

      if (!cachedEmoji) return interaction.reply({ content: "No Emoji Found" });
      const emoji =
        cachedEmoji.animated === false
          ? ` <:${cachedEmoji.name}:${cachedEmoji.id}> `
          : ` <a:${cachedEmoji.name}:${cachedEmoji.id}> `;

      embed
        .setColor("PURPLE")
        .setDescription(
          `**\`\`\`Information On ${
            cachedEmoji.name
          } Emoji\`\`\`**\n${emoji.repeat(15)}`
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Name",
            value: `\`\`\`${cachedEmoji.name}\`\`\``,
            inline: true,
          },
          {
            name: "ID",
            value: `\`\`\`${cachedEmoji.id}\`\`\``,
            inline: true,
          },
          {
            name: "URL",
            value: `[\`\`\`${cachedEmoji.name}\`\`\`](${cachedEmoji.url} "${cachedEmoji.name} Emoji URL")`,
            inline: true,
          }
        )
        .setFooter({
          text: `BTU `,
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], files: [Logo] });
    }
  },
});
