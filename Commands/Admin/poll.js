const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "poll",
  description: "make a poll",
  showHelp: false,
  type: "SLASH",
  permissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "STRING",
      name: "title",
      description: "სახელი",
      required: true,
    },
    {
      type: "STRING",
      name: "description",
      description: "აღწერა",
      required: true,
    },
    {
      type: "INTEGER",
      name: "time",
      description: "დრო საათებში რომლის შემდეგაც დაიხურება ხმის დათვლა",
      required: true,
      minValue: 1,
      maxValue: 72,
    },
  ],

  async run(interaction, args, client) {
    let yesCount = 0;
    let noCount = 0;
    const yesMemberArray = [];
    const noMemberArray = [];

    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const time = interaction.options.getInteger("time") * 3600000;
    const channel = client.channels.cache.find((c) => c.name == "📊polls");
    const logsChannel = client.channels.cache.find((c) => c.name == "poll-logs");

    const date = `<t:${Math.floor(
      (interaction.createdTimestamp + time) / 1000
    )}:R>`;

    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(`${description.replaceAll("|", "\n")}`)
      .setColor("PURPLE")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: `BTU `,
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .addFields(
        {
          name: "Yes",
          value: `**\`${yesCount}\`**`,
          inline: true,
        },
        {
          name: "No",
          value: `**\`${noCount}\`**`,
          inline: true,
        },
        {
          name: "⠀",
          value: `Voting Ends ${date}`,
        }
      )
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("voteyes")
        .setEmoji("✔️")
        .setLabel("Yes")
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("voteno")
        .setEmoji("❌")
        .setLabel("No")
        .setStyle("PRIMARY")
    );

    interaction.followUp({ content: `Poll შეიქმნა და გაიგზავნა` });
    channel.send({ embeds: [embed], components: [row] }).then((message) => {
      const collector = message.createMessageComponentCollector({
        time: time,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "voteyes") {
          if (yesMemberArray.includes(i.user.id)) return;
          else if (noMemberArray.includes(i.user.id)) {
            const index = noMemberArray.indexOf(i.user.id);
            noMemberArray.splice(index, 1);
            noCount -= 1;
            embed.fields.find(
              (f) => f.name === "No"
            ).value = `**\`${noCount}\`**`;
          }
          yesMemberArray.push(i.user.id);
          yesCount += 1;
          embed.fields.find(
            (f) => f.name === "Yes"
          ).value = `**\`${yesCount}\`**`;
          message.edit({ embeds: [embed] });
          logsChannel.send({ content: `<@!${i.user.id}> Voted Yes on Poll named ${title}` })
        } else if (i.customId === "voteno") {
          if (noMemberArray.includes(i.user.id)) return;
          else if (yesMemberArray.includes(i.user.id)) {
            const index = yesMemberArray.indexOf(i.user.id);
            yesMemberArray.splice(index, 1);
            yesCount -= 1;
            embed.fields.find(
              (f) => f.name === "Yes"
            ).value = `**\`${yesCount}\`**`;
          }
          noMemberArray.push(i.user.id);
          noCount += 1;
          embed.fields.find(
            (f) => f.name === "No"
          ).value = `**\`${noCount}\`**`;
          message.edit({ embeds: [embed] });
          logsChannel.send({ content: `<@!${i.user.id}> Voted No on Poll named ${title}` })
        }
      });

      collector.on("end", (reason) => {
        embed.fields.find((f) => f.name === "⠀").value = `Voting Ended ${date}`;
        message.edit({
          embeds: [embed],
          components: [],
        });
      });
    });
  },
});
