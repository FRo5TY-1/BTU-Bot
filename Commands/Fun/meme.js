const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const https = require("https");

module.exports = new Command({
  name: "meme",
  description: "Get A Random Meme",
  type: "SLASH",

  async run(interaction, args) {
    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("nextmeme")
        .setLabel("Next Meme")
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId("finishmeme")
        .setLabel("Finish")
        .setStyle("DANGER")
    );
    embed
      .setColor("PURPLE")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    function getMeme() {
      https
        .get("https://api.popcat.xyz/meme", (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            data = JSON.parse(data);
            embed
              .setDescription(`[**${data.title}**](${data.url})`)
              .setImage(data.image)
              .setFooter({
                text: `Upvotes - ${data.upvotes}`,
                iconURL: "attachment://BTULogo.png",
              });
            return interaction.editReply({
              embeds: [embed],
              files: [Logo],
              components: [row],
            });
          });
        })
        .on("error", (err) => {
          return;
        });
    }

    getMeme();

    const collector = interaction.channel.createMessageComponentCollector({
      time: 120000,
      errors: ["time"],
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "nextmeme") {
        getMeme();
      } else if (i.customId === "finishmeme") {
        collector.stop();
      }
    });

    collector.on("end", (reason) => {
      interaction.editReply({ components: [] });
    });
  },
});
