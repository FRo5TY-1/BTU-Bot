const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const emojiRegex =
  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;

module.exports = new SlashCommand({
  name: "poll",
  description: "Make A Poll",
  permissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "STRING",
      name: "title",
      description: "TiTle Of The Poll",
      required: true,
    },
    {
      type: "CHANNEL",
      name: "channel",
      description: "Chanel Where Poll Will Be Held",
      required: true,
    },
    {
      type: "INTEGER",
      name: "time",
      description: "Time In Hours, After Which The Poll Ends",
      required: true,
      minValue: 1,
      maxValue: 72,
    },
    {
      type: "STRING",
      name: "option1-text",
      description: "First Choice Text",
    },
    {
      type: "STRING",
      name: "option2-text",
      description: "Second Choice Text",
    },
    {
      type: "STRING",
      name: "option1-emoji",
      description: "First Choice Custom Emoji ID Or Built In Emoji",
      required: false,
    },
    {
      type: "STRING",
      name: "option2-emoji",
      description: "Second Choice Custom Emoji ID Or Built In Emoji",
      required: false,
    },
    {
      type: "STRING",
      name: "description",
      description: "Description (Use '|' To Separate Lines)",
      required: false,
    },
    {
      type: "STRING",
      name: "content",
      description: "Text Before The Embed (Use '|' To Separate Lines)",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    let text1Count = 0;
    let text2Count = 0;
    const option1MemberArray = [];
    const option2MemberArray = [];

    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description") || "\n";
    const time = interaction.options.getInteger("time") * 3600000; //3600000
    const channel = interaction.options.getChannel("channel");
    const content = interaction.options.getString("content") || " ";
    let text1 = interaction.options.getString("option1-text") || "";
    let text2 = interaction.options.getString("option2-text") || "";
    const emoji1 = interaction.options.getString("option1-emoji") || "";
    const emoji2 = interaction.options.getString("option2-emoji") || "";
    const logsChannel = interaction.guild.channels.cache
      .filter((c) => c.isText())
      .find((c) => c.name == "poll-logs");

    if (!channel.isText())
      return interaction.reply({ content: "Please Select Text Channel" });

    const matcher1 = emoji1.match(/\d+/g) ? emoji1.match(/\d+/g)[0] : null;
    const matcher2 = emoji2.match(/\d+/g) ? emoji2.match(/\d+/g)[0] : null;

    if (
      emoji1.length &&
      !(emoji1.match(emojiRegex) || client.emojis.cache.get(matcher1))
    ) {
      return interaction.reply({
        content: "text1 Emoji Is Invalid",
        ephemeral: true,
      });
    }
    if (
      emoji2.length &&
      !(emoji2.match(emojiRegex) || client.emojis.cache.get(matcher2))
    ) {
      return interaction.reply({
        content: "text2 Emoji Is Invalid",
        ephemeral: true,
      });
    }

    if (!text1.length && !emoji1.length) text1 = "Option1";
    if (!text2.length && !emoji2.length) text2 = "Option2";

    const date = `<t:${Math.floor(
      (interaction.createdTimestamp + time) / 1000
    )}:R>`;

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
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
        iconURL: "attachment://BTULogo.png",
      })
      .addFields(
        {
          name: `${text1} ${emoji1}`,
          value: `**\` ${text1Count} \`**`,
          inline: true,
        },
        {
          name: `${text2} ${emoji2}`,
          value: `**\` ${text2Count} \`**`,
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
        .setLabel(text1)
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId("voteno")
        .setLabel(text2)
        .setStyle("DANGER")
    );
    if (emoji1.length) row.components[0].setEmoji(emoji1);
    if (emoji2.length) row.components[1].setEmoji(emoji2);

    interaction.reply({
      content: `Poll შეიქმნა და გაიგზავნა`,
      ephemeral: true,
    });

    const message = await channel.send({
      content: content.replaceAll(("|", "\n")),
      embeds: [embed],
      components: [row],
      files: [Logo],
    });

    const collector = message.createMessageComponentCollector({
      time: time,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      if (i.customId === "voteyes") {
        if (option1MemberArray.includes(i.user.id)) return;
        else if (option2MemberArray.includes(i.user.id)) {
          const index = option2MemberArray.indexOf(i.user.id);
          option2MemberArray.splice(index, 1);
          text2Count -= 1;
          embed.fields[1].value = `**\` ${text2Count} \`**`;
        }
        option1MemberArray.push(i.user.id);
        text1Count += 1;
        embed.fields[0].value = `**\` ${text1Count} \`**`;
        message?.edit({ embeds: [embed] });
      } else if (i.customId === "voteno") {
        if (option2MemberArray.includes(i.user.id)) return;
        else if (option1MemberArray.includes(i.user.id)) {
          const index = option1MemberArray.indexOf(i.user.id);
          option1MemberArray.splice(index, 1);
          text1Count -= 1;
          embed.fields[0].value = `**\` ${text1Count} \`**`;
        }
        option2MemberArray.push(i.user.id);
        text2Count += 1;
        embed.fields[1].value = `**\` ${text2Count} \`**`;
        message?.edit({ embeds: [embed] });
      }
    });

    collector.on("end", (reason) => {
      embed.fields[2].value = `Voting Ended ${date}`;
      message?.edit({
        embeds: [embed],
        components: [],
      });
      logsChannel?.send({ content: `Poll Named \`${title}\` Ended` });
      logsChannel?.send({
        content: `People Who Voted ${text1} ${emoji1} : ${option1MemberArray.map(
          (i) => `<@!${i}>`
        )}`,
        allowMentions: false,
      });
      logsChannel?.send({
        content: `People Who Voted ${text2} ${emoji2} : ${option2MemberArray.map(
          (i) => `<@!${i}>`
        )}`,
        allowMentions: false,
      });
    });
  },
});
