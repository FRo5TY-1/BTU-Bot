const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "help",
  aliases: ["h"],
  description: "sends a help message",
  type: "BOTH",

  async run(message, args, client) {
    const file = new Discord.MessageAttachment("Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
    .setColor("PURPLE")
    .setTitle("BTU Help")
    .setThumbnail("attachment://BTULogo.png")
    const commands = client.commands.filter((x) => x.showHelp != false && x.type !== "SLASH" );

    embed.setDescription("ㅤ")
    .addField(
      `${commands.size} Commands Available`,
      " <:BatChest:924385583567081492> " +
        commands
          .map(
            (x) =>
              `\`${x.name}${
                x.aliases ? ` (${x.aliases.map((y) => y).join(", ")}) \`` : "`"
              }`
          )
          .join(" <:BatChest:924385583567081492> ") +
        " <:BatChest:924385583567081492> "
    )
    .setTimestamp();

    if (message.isCommand) {
      message.followUp({ embeds: [embed], files: [file] });
    }else{
      message.reply({ embeds: [embed], files: [file] });
    }
  },
});
