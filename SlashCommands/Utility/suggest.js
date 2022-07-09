const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "suggest",
  description: "Make A Suggestion",
  premium: true,
  options: [
    {
      type: "STRING",
      name: "title",
      description: "Title",
      required: true,
    },
    {
      type: "STRING",
      name: "description",
      description: "Description",
      required: true,
    },
    {
      type: "BOOLEAN",
      name: "anonymous",
      description: "Should The Suggestion Be anonymous?",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const anonymous = interaction.options.getBoolean("anonymous");
    const channel = interaction.guild.channels.cache.find(
      (c) => c.name == "💡suggestions"
    );
    const logsChannel = interaction.guild.channels.cache.find(
      (c) => c.name == "suggestion-logs"
    );

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(`\`\`\`${description.replaceAll("|", "\n")}\`\`\``)
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();
    if (anonymous == true) {
      embed.setAuthor({
        name: "Anonymous",
        iconURL: "attachment://BTULogo.png",
      });
    } else {
      embed.setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
    }

    interaction.reply({
      content: `Suggestion Created And Sent Successfully`,
    });
    channel?.send({ embeds: [embed], files: [Logo] });
    logsChannel?.send({
      content: `<@!${interaction.user.id}> made a suggestion ${title}`,
    });
  },
});
