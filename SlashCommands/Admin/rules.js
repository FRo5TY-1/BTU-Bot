const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "rules",
  permissions: ["ADMINISTRATOR"],
  description: "Rules Message",

  async run(interaction) {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed()
      .setTitle("▬▬▬▬▬▬▬▬▬▬ Server Rules ▬▬▬▬▬▬▬▬▬▬")
      .setDescription(
        `
      \`\`\`1. აუცილებლად დაიცავით ცენზურა\n2. პატივი ეცით სერვერის ყველა წევრს\n3. დაუშვებელია ყველანაირი ტიპის სპამი\`\`\`
      `
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    const message = interaction.channel.messages
      .fetch("927907530926096465")
      .then((message) => message.edit({ embeds: [embed], files: [Logo] }));
    return interaction.deleteReply();
  },
});
