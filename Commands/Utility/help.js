const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "help",
  description: "Get A Help Embed",
  type: "SLASH",

  async run(interaction, args, client) {
    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
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

    interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
