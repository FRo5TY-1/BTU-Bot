const SlashCommand = require("../../Structures/SlashCommand.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "leaderboard",
  description: "💳 shows leaderboard",
  options: [
    {
      type: "STRING",
      name: "option",
      description: "Choose Which Type Of Leaderboard You Want To See",
      choices: [
        { name: "Local", value: "local" },
        { name: "Global", value: "global" },
      ],
    },
    {
      name: "page",
      description: "გვერდი",
      type: "INTEGER",
      minValue: 1,
      required: false,
    },
  ],

  async run(interaction, args, client) {
    await interaction.deferReply();

    let page = interaction.options.getInteger("page") || 1;
    let end = page * 10;

    const option = interaction.options.getString("option") || "local";

    let userArray = [];

    if (option == "local") {
      const data = await profileModel
        .find({
          guildId: interaction.guild.id,
        })
        .sort([["BTUcoins", -1]]);

      userArray = data.map((u, i) => {
        return `**${i + 1}.** <@!${u.userID}> \` | \` **${u.BTUcoins}** Coins`;
      });
    } else {
      const data = await profileModel.find({}).sort([["BTUcoins", -1]]);

      userArray = data.map((u, i) => {
        return `**${i + 1}.** <@!${u.userID}> \` | \` **${
          u.BTUcoins
        }** Coins **${u.guildId}**`;
      });
    }

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("BTU Coins Leaderboard")
      .setDescription(
        `${userArray.slice(end - 10, end).join("\n") || "This Page Is Empty"}`
      )
      .setColor("PURPLE")
      .setFooter({
        text: `Page ${page}`,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("prevpage")
        .setLabel("Previous Page")
        .setEmoji("◀️")
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("nextpage")
        .setLabel("Next Page")
        .setEmoji("▶️")
        .setStyle("PRIMARY")
    );

    const message = await interaction.followUp({
      embeds: [embed],
      components: [row],
      files: [Logo],
    });

    const collector = message.createMessageComponentCollector({
      time: 30000,
      errors: ["time"],
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      if (i.customId === "prevpage") {
        if (page > 1) {
          page -= 1;
          end = page * 5;
          embed.description = `${
            userArray.slice(end - 10, end).join("\n") || "This Page Is Empty"
          }`;
          embed.footer.text = `Page ${page}`;
          return message?.edit({ embeds: [embed] });
        }
      } else if (i.customId === "nextpage") {
        page += 1;
        end = page * 10;
        embed.description = `${
          userArray.slice(end - 10, end).join("\n") || "This Page Is Empty"
        }`;
        embed.footer.text = `Page ${page}`;
        return message?.edit({ embeds: [embed] });
      }
    });

    collector.on("end", (reason) => {
      message?.edit({ components: [] });
    });
  },
});
