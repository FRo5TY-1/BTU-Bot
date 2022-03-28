const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "leaderboard",
  description: "shows leaderboard",
  type: "SLASH",
  options: [
    {
      name: "page",
      description: "გვერდი",
      type: "INTEGER",
      minValue: 1,
      required: false,
    },
  ],

  async run(interaction, args, client) {
    let page = interaction.options.getInteger("page") || 1;

    const end = page * 10;
    const start = page * 10 - 10;

    embed = new Discord.MessageEmbed();
    embed
      .setTitle("BTU Coins Leaderboard")
      .setColor("PURPLE")
      .setFooter({
        text: `Page ${page}`,
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("prevpage")
        .setEmoji("◀️")
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("nextpage")
        .setEmoji("▶️")
        .setStyle("PRIMARY")
    );

    Data = await profileModel
      .find({})
      .sort([["BTUcoins", -1]])
      .exec((err, res) => {
        if (err) console.log(err);

        if (res.length <= start) {
          embed.setDescription(`მონაცემები არ არსებობს`);
          return interaction.followUp({ embeds: [embed] });
        }

        const usersArray = [];

        for (i = start; i < end; i++) {
          if (!res[i]) continue;
          usersArray.push(
            `${i + 1}. <@!${res[i].userID}> \` | \` **${
              res[i].BTUcoins
            }** Coins`
          );
        }

        embed.setDescription(usersArray.join("\n"));

        interaction.followUp({ embeds: [embed], components: [row] });

        const userChannel = interaction.channel;
        const collector = userChannel.createMessageComponentCollector({
          time: 15000,
          errors: ["time"],
          filter: (i) => i.user.id === interaction.user.id,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "prevpage") {
            if (page <= 1) return;
            page--;
            const end = page * 10;
            const start = page * 10 - 10;

            embed
              .setTitle("BTU Coins Leaderboard")
              .setColor("PURPLE")
              .setFooter({
                text: `Page ${page}`,
                iconURL:
                  "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
              })
              .setTimestamp();

            if (res.length <= start) {
              embed.setDescription(`მონაცემები არ არსებობს`);
              return i.message.edit({ embeds: [embed] });
            }
            const buttonUsersArray = [];
            for (k = start; k < end; k++) {
              if (!res[k]) continue;
              buttonUsersArray.push(
                `${k + 1}. <@!${res[k].userID}> \` | \` **${
                  res[k].BTUcoins
                }** Coins`
              );
            }
            embed.setDescription(buttonUsersArray.join("\n"));
            i.message.edit({ embeds: [embed] });
          } else if (i.customId === "nextpage") {
            page = page + 1;
            const end = page * 10;
            const start = page * 10 - 10;

            embed
              .setTitle("BTU Coins Leaderboard")
              .setColor("PURPLE")
              .setFooter({
                text: `Page ${page}`,
                iconURL:
                  "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
              })
              .setTimestamp();

            if (res.length <= start) {
              embed.setDescription(`მონაცემები არ არსებობს`);
              return i.message.edit({ embeds: [embed] });
            }

            const buttonUsersArray = [];
            for (k = start; k < end; k++) {
              if (!res[k]) continue;
              buttonUsersArray.push(
                `${k + 1}. <@!${res[k].userID}> \` | \` **${
                  res[k].BTUcoins
                }** Coins`
              );
            }
            embed.setDescription(buttonUsersArray.join("\n"));
            return i.message.edit({ embeds: [embed] });
          }
        });

        collector.on("end", (reason) => {
          interaction.editReply({ components: [] });
        });
      });
  },
});
