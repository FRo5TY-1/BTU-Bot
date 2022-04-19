const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "poll",
  description: "Make A Poll",
  showHelp: false,
  type: "SLASH",
  permissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "STRING",
      name: "title",
      description: "TiTle Of The Poll",
      required: true,
    },
    {
      type: "STRING",
      name: "option1",
      description: "First Choice Text",
      required: true,
    },
    {
      type: "STRING",
      name: "option2",
      description: "Second Choice Text",
      required: true,
    },
    {
      type: "CHANNEL",
      name: "channel",
      description: "Chich Channel To Be Sent In",
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
      name: "description",
      description:
        "Description (Use '|' To Separate Lines, and '`' For Code Blocks)",
      required: false,
    },
    {
      type: "STRING",
      name: "content",
      description:
        "Text Before The Embed (Use '|' To Separate Lines, and '`' For Code Blocks)",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    let yesCount = 0;
    let noCount = 0;
    const yesMemberArray = [];
    const noMemberArray = [];

    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description") || "\n";
    const time = interaction.options.getInteger("time") * 3600000; //3600000
    const channel = interaction.options.getChannel("channel");
    const content = interaction.options.getString("content") || " ";
    const option1 = interaction.options.getString("option1");
    const option2 = interaction.options.getString("option2");
    const logsChannel = interaction.guild.channels.cache.find(
      (c) => c.name == "poll-logs"
    );

    const date = `<t:${Math.floor(
      (interaction.createdTimestamp + time) / 1000
    )}:R>`;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(`${description.replaceAll(("|", "\n"), ("`", "`"))}`)
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
          name: option1,
          value: `**\`${yesCount}\`**`,
          inline: true,
        },
        {
          name: option2,
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
        .setLabel(option1)
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId("voteno")
        .setLabel(option2)
        .setStyle("DANGER")
    );

    interaction.followUp({ content: `Poll შეიქმნა და გაიგზავნა` });
    channel
      .send({
        content: content.replaceAll(("|", "\n"), ("`", "`")),
        embeds: [embed],
        components: [row],
        files: [Logo],
      })
      .then((message) => {
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
                (f) => f.name === option2
              ).value = `**\`${noCount}\`**`;
            }
            yesMemberArray.push(i.user.id);
            yesCount += 1;
            embed.fields.find(
              (f) => f.name === option1
            ).value = `**\`${yesCount}\`**`;
            message.edit({ embeds: [embed] });
            logsChannel?.send({
              content: `<@!${i.user.id}> Voted ${option1} on Poll named ${title}`,
            });
          } else if (i.customId === "voteno") {
            if (noMemberArray.includes(i.user.id)) return;
            else if (yesMemberArray.includes(i.user.id)) {
              const index = yesMemberArray.indexOf(i.user.id);
              yesMemberArray.splice(index, 1);
              yesCount -= 1;
              embed.fields.find(
                (f) => f.name === option1
              ).value = `**\`${yesCount}\`**`;
            }
            noMemberArray.push(i.user.id);
            noCount += 1;
            embed.fields.find(
              (f) => f.name === option2
            ).value = `**\`${noCount}\`**`;
            message.edit({ embeds: [embed] });
            logsChannel?.send({
              content: `<@!${i.user.id}> Voted ${option2} on Poll named ${title}`,
            });
          }
        });

        collector.on("end", (reason) => {
          embed.fields.find(
            (f) => f.name === "⠀"
          ).value = `Voting Ended ${date}`;
          message.edit({
            embeds: [embed],
            components: [],
          });
        });
      });
  },
});
