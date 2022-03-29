const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "help",
  description: "ნახეთ ბრძანებების ჩამონათვალი",
  type: "SLASH",

  async run(interaction, args, client) {
    const embed = new Discord.MessageEmbed();

    embed
      .setColor("PURPLE")
      .setTitle("BTU Help")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
    const commands = client.slashCommands.filter(
      (x) => x.showHelp != false
    );

    embed
      .addField(
        `${commands.size} Commands Available`,
          commands
            .map(
              (x) =>
                `\`${x.name}${
                  x.aliases
                    ? ` (${x.aliases.map((y) => y).join(", ")}) \``
                    : "`"
                }`
            )
            .join("** | **")
      )
      .setFooter({
        text: `BTU `,
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });
  },
});
