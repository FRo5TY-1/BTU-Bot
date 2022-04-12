const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "suggest",
  description: "make a suggestion",
  showHelp: false,
  type: "SLASH",
  ephemeral: true,
  options: [
    {
      type: "STRING",
      name: "title",
      description: "სახელი",
      required: true,
    },
    {
      type: "STRING",
      name: "description",
      description: "აღწერა",
      required: true,
    },
    {
      type: "BOOLEAN",
      name: "anonymous",
      description: "ანონიმურად დაიპოსტოს თუ არა",
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

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
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

    interaction.followUp({ content: `Suggestion შეიქმნა და გაიგზავნა` });
    channel.send({ embeds: [embed], files: [Logo] });
    logsChannel.send({ content: `<@!${interaction.user.id}> made a suggestion` })
  },
});
