const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const rolesModel = require("../../DBModels/buttonRolesSchema.js");
const emojiRegex =
  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;

module.exports = new Command({
  name: "button-role",
  showHelp: false,
  permissions: ["ADMINISTRATOR"],
  description: "Add Or Remove A Button Role",
  type: "SLASH",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "Add A Button Role",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Channel In Which The Message Is In",
          required: true,
        },
        {
          type: "STRING",
          name: "message-id",
          description: "ID Of The Message To Which You Want To Add The Buttons",
          required: true,
        },
        {
          type: "STRING",
          name: "custom-id",
          description: "ID Of The Button (Can Be Anything)",
          required: true,
        },
        {
          type: "STRING",
          name: "style",
          description: "Button Style",
          required: true,
          choices: [
            { name: "Blue", value: "PRIMARY" },
            { name: "Gray", value: "SECONDARY" },
            { name: "Green", value: "SUCCESS" },
            { name: "Red", value: "DANGER" },
          ],
        },
        {
          type: "STRING",
          name: "role-id",
          description:
            "ID Of Role That's Going To Be Given/Taken When Button Is Clicked On",
          required: true,
        },
        {
          type: "BOOLEAN",
          name: "changable",
          description: "Chould This Role Be Taken Away After Clicked Twice?",
          required: true,
        },
        {
          type: "STRING",
          name: "button-name",
          description: "Text That's Going To Be Displayed On The Button",
          required: false,
        },
        {
          type: "STRING",
          name: "emoji",
          description: "ID Of Custom Emoji Or Built In Discord Emoji",
          required: false,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "Remove A Button Role",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Channel In Which The Message Is Located",
          required: true,
        },
        {
          type: "STRING",
          name: "custom-id",
          description: "ID Of The Button",
          required: true,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    async function updateButtons(message, messageID) {
      const buttonsData = await rolesModel
        .find({
          messageID: messageID,
        })
        .exec();

      const buttonsArray = [];

      buttonsData.forEach((obj) => {
        const button = new Discord.MessageButton()
          .setCustomId(obj.buttonCustomID)
          .setLabel(obj.buttonLabel)
          .setStyle(obj.buttonStyle);
        if (obj.buttonEmojiID) button.setEmoji(obj.buttonEmojiID);
        buttonsArray.push(button);
      });

      const row1 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(0, 5)
      );
      const row2 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(5, 10)
      );
      const row3 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(10, 15)
      );
      const row4 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(15, 20)
      );
      const row5 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(20, 25)
      );

      const components =
        buttonsArray.length == 0
          ? []
          : buttonsArray.length <= 5
          ? [row1]
          : buttonsArray.length <= 10
          ? [row1, row2]
          : buttonsArray.length <= 15
          ? [row1, row2, row3]
          : buttonsArray.length <= 20
          ? [row1, row2, row3, row4]
          : [row1, row2, row3, row4, row5];

      message.edit({ components: components });
    }
    if (interaction.options.getSubcommand() === "add") {
      const channel = interaction.options.getChannel("channel");
      const messageID = interaction.options.getString("message-id");
      const customID = interaction.options.getString("custom-id");
      const style = interaction.options.getString("style");
      const roleID = interaction.options.getString("role-id");
      const changale = interaction.options.getBoolean("changable");
      const label = interaction.options.getString("button-name") || " ";
      const emoji = interaction.options.getString("emoji") || null;
      const role = interaction.guild.roles.cache.get(roleID);

      const matcher = emoji.match(/\d+/g) ? emoji.match(/\d+/g)[0] : null;

      if (
        emoji &&
        !(emoji.match(emojiRegex) || client.emojis.cache.get(matcher))
      ) {
        return interaction.reply({
          content: "Invalid Emoji",
          ephemeral: true,
        });
      }

      if (!role)
        return interaction.reply({
          content: "Role Doesnt Exist",
          ephemeral: true,
        });

      const message = await channel.messages?.fetch(messageID);

      if (!message)
        return interaction.reply({
          content: "Message Doesnt Exist",
          ephemeral: true,
        });

      await rolesModel.create({
        guildID: interaction.guild.id,
        messageID: messageID,
        buttonCustomID: customID,
        buttonStyle: style,
        buttonLabel: label,
        buttonEmojiID: emoji,
        roleID: roleID,
        changable: changale,
      });

      updateButtons(message, messageID);

      const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
      const embed = new Discord.MessageEmbed();

      embed
        .setTitle("Successfully Added Role Button")
        .setDescription(
          "```Object Was Added To DataBase And The Button To The Given Message```"
        )
        .setColor("PURPLE")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: "BTU ",
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        files: [Logo],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const channel = interaction.options.getChannel("channel");
      const customID = interaction.options.getString("custom-id");

      const findButton =
        (await rolesModel.findOne({
          guildID: interaction.guild.id,
          buttonCustomID: customID,
        })) || null;

      if (findButton === null)
        return interaction.reply({
          content: "Object Doesn't Exist",
          ephemeral: true,
        });

      const messageID = findButton.messageID;

      const message = await channel.messages?.fetch(messageID);

      if (!message)
        return interaction.reply({
          content: "Message Doesnt Exist",
          ephemeral: true,
        });

      await rolesModel.deleteOne({
        guildID: interaction.guild.id,
        buttonCustomID: customID,
      });

      updateButtons(message, messageID);

      const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
      const embed = new Discord.MessageEmbed();

      embed
        .setTitle("Successfully Removed Role Button")
        .setDescription(
          "```Object Was Removed From DataBase And The Button From The Given Message```"
        )
        .setColor("PURPLE")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: "BTU ",
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        files: [Logo],
        ephemeral: true,
      });
    }
  },
});
