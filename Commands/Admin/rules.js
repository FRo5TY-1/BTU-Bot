const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "rules",
  showHelp: false,
  permissions: ["ADMINISTRATOR"],
  description: "Rules Message",
  type: "SLASH",

  /**
   * @param {Discord.Interaction} interaction
   */
  async run(interaction) {
    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed()
      .setTitle("▬▬▬▬▬▬▬▬▬▬ Server Rules ▬▬▬▬▬▬▬▬▬▬")
      .setDescription(
        `
      \`\`\`1. აუცილებლად დაიცავით ცენზურა\n2. პატივი ეცით სერვერის ყველა წევრს\n3. დაუშვებელია ყველანაირი ტიპის სპამი\n\nღილაკზე დაჭერით ადასტურებთ რომ ეთანხმებით წესებს\`\`\`
      `
      )
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("rulesagree")
        .setEmoji("✔️")
        .setLabel("ვეთანხმები")
        .setStyle("SUCCESS")
    );
    const message = interaction.channel.messages
      .fetch("927907530926096465")
      .then((message) =>
        message.edit({ embeds: [embed], components: [row], files: [Logo] })
      );
    return interaction.deleteReply()
    ;
  },
});
