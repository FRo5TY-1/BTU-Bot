const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "help",
  description: "Get A Help Embed",

  async run(interaction, args, client) {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
      .setColor("PURPLE")
      .setTitle("BTU Help")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
    const commands = client.slashCommands.filter((x) => x.showHelp != false);

    embed
      .addField(
        `${commands.size} Commands Available`,
        commands
          .map(
            (x) =>
              `\`${x.name}${
                x.aliases ? ` (${x.aliases.map((y) => y).join(", ")}) \`` : "`"
              }`
          )
          .join("** | **")
      )
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], files: [Logo] });
  },
});