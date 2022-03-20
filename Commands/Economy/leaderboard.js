const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "leaderboard",
  description: "shows leaderboard",
  aliases: ["lb", "top"],

  async run(message, args, client) {
    let page = args[0];
    if (!page) page = 1;
    if (isNaN(page) || Number(page) < 1)
      return message.reply("მიუთითეთ გვერდი: 1-დან ზევით მთელი რიცხვი");
    const end = page * 10;
    const start = page * 10 - 10;

    const file = new Discord.MessageAttachment("Pictures/BTULogo.png");

    embed1 = new Discord.MessageEmbed()
      .setTitle("BTU Coins Leaderboard")
      .setColor("PURPLE")
      .setThumbnail("attachment://BTULogo.png")
      .setDescription("⠀")
      .setFooter({
        text: `Page: ${page}`,
      });

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
          embed1.addField(`მონაცემები არ არსებობს`, "⠀");
          return message.channel.send({ embeds: [embed1], files: [file] });
        }

        for (i = start; i < end; i++) {
          if (!res[i]) continue;
          embed1.addField(
            `${i + 1}. ${client.users.cache.get(res[i].userID).username}`,
            `BTU Coins: **${res[i].BTUcoins}**`
          );
        }

        const filter = (interaction) => {
          if (interaction.user.id === message.author.id) return true;
          else
            return interaction.followUp({
              content: "ეს არ არის თქვენი ბრძანება",
              ephemeral: true,
            });
        };

        message.channel
          .send({ embeds: [embed1], files: [file], components: [row] })
          .then((message) => {
            const collector = message.createMessageComponentCollector(filter, {
              time: 5000,
            });

            collector.on("collect", async (i) => {
              if (i.customId === "prevpage") {
                if (page <= 1) return;
                page--;
                const end = page * 10;
                const start = page * 10 - 10;

                const embed2 = new Discord.MessageEmbed()
                  .setTitle("BTU Coins Leaderboard")
                  .setColor("PURPLE")
                  .setThumbnail("attachment://BTULogo.png")
                  .setFooter({
                    text: `Page: ${page}`,
                  });

                if (res.length <= start) {
                  embed2.addField(`მონაცემები არ არსებობს`, "⠀");
                  return message.edit({ embeds: [embed2], files: [file] });
                }

                for (k = start; k < end; k++) {
                  if (!res[k]) continue;
                  embed2.addField(
                    `${k + 1}. ${
                      client.users.cache.get(res[k].userID).username
                    }`,
                    `BTU Coins: **${res[k].BTUcoins}**`
                  );
                }
                message.edit({ embeds: [embed2], files: [file] });
              } else if (i.customId === "nextpage") {
                page = page + 1;
                const end = page * 10;
                const start = page * 10 - 10;

                const embed2 = new Discord.MessageEmbed()
                  .setTitle("BTU Coins Leaderboard")
                  .setColor("PURPLE")
                  .setThumbnail("attachment://BTULogo.png")
                  .setFooter({
                    text: `Page: ${page}`,
                  });

                if (res.length <= start) {
                  embed2.addField(`მონაცემები არ არსებობს`, "⠀");
                  return message.edit({ embeds: [embed2], files: [file] });
                }

                for (k = start; k < end; k++) {
                  if (!res[k]) continue;
                  embed2.addField(
                    `${k + 1}. ${
                      client.users.cache.get(res[k].userID).username
                    }`,
                    `BTU Coins: **${res[k].BTUcoins}**`
                  );
                }
                message.edit({ embeds: [embed2], files: [file] });
              }
            });

            collector.on("end", async (i) => {});
          });
      });
  },
});
