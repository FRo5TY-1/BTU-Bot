const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const rolesModel = require("../../DBModels/buttonRolesSchema.js");

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
          name: "emoji-id",
          description: "ID Of Emoji That's Going To Be Displayed On The Button",
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
        buttonsArray.slice(0, 6)
      );
      const row2 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(5, 11)
      );
      const row3 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(10, 16)
      );
      const row4 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(15, 21)
      );
      const row5 = new Discord.MessageActionRow().addComponents(
        buttonsArray.slice(20, 26)
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
      const emojiID = interaction.options.getString("emoji-id") || null;
      const role = interaction.guild.roles.cache.get(roleID);

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
        buttonEmojiID: emojiID,
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
