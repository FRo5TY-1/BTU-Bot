const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "emojis",
  description: "Get A List Of Server Emojis",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "name",
      description: "Get Information On Specific Emoji",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const emojiName = interaction.options.getString("name") || null;

    if (emojiName !== null) {
      const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
      const embed = new Discord.MessageEmbed();

      const cachedEmoji = interaction.guild.emojis.cache.find(
        (e) => e.name.toLowerCase() === emojiName.toLowerCase()
      );

      if (!cachedEmoji)
        return interaction.followUp({ content: "No Emoji Found" });
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
          { name: "ID", value: `\`\`\`${cachedEmoji.id}\`\`\``, inline: true },
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

      interaction.followUp({ embeds: [embed], files: [Logo] });
    } else {
      const emojis = interaction.guild.emojis.cache.map((e) => {
        if (e.animated)
          return `<a:${e.name}:${e.id}> [\`URL\`](${e.url} "${e.name} Emoji URL")`;
        return `<:${e.name}:${e.id}> [\`URL\`](${e.url} "${e.name} Emoji URL")`;
      });
      const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
      const embed = new Discord.MessageEmbed();
      embed
        .setColor("PURPLE")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `**\`\`\`List Of Server Emojis\`\`\`\n${emojis.join(" `|` ")}**`
        )
        .setFooter({
          text: `BTU `,
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      interaction.followUp({ embeds: [embed], files: [Logo] });
    }
  },
});
