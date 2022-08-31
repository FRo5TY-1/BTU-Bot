const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const { ButtonRole } = require("../../Database/index");

const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
const emojiRegex =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

module.exports = new SlashCommand({
  name: "button-role",
  permissions: ["ADMINISTRATOR"],
  description: "Add Or Remove A Button Role",
  premium: true,
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
    async function updateButtons(message, messageId) {
      const buttonsData = await ButtonRole.find({
        messageId: messageId,
      });

      const buttonsArray = [];

      buttonsData.forEach((obj) => {
        const button = new Discord.MessageButton()
          .setCustomId(obj.buttonCustomId)
          .setLabel(obj.buttonLabel)
          .setStyle(obj.buttonStyle);
        if (obj.buttonEmojiId) button.setEmoji(obj.buttonEmojiId);
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
      const messageId = interaction.options.getString("message-id");
      const customId = interaction.options.getString("custom-id");
      const style = interaction.options.getString("style");
      const roleId = interaction.options.getString("role-id");
      const changale = interaction.options.getBoolean("changable");
      const label = interaction.options.getString("button-name") || " ";
      const emoji = interaction.options.getString("emoji") || null;
      const role = interaction.guild.roles.cache.get(roleId);

      const emojiMatch = emoji.match(/(<a?:)?\w*:?\d{18}>?/);

      const baseEmojiMatch = emoji.match(emojiRegex);

      const emojiId = baseEmojiMatch
        ? baseEmojiMatch[0]
        : emojiMatch
        ? emojiMatch[0].replace(/\D+/g, "")
        : null;

      if (emoji && !(baseEmojiMatch || client.emojis.cache.get(emojiId))) {
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

      const message = await channel.messages?.fetch(messageId);

      if (!message)
        return interaction.reply({
          content: "Message Doesnt Exist",
          ephemeral: true,
        });

      await ButtonRole.create({
        guildId: interaction.guild.id,
        messageId: messageId,
        buttonCustomId: customId,
        buttonStyle: style,
        buttonLabel: label,
        buttonEmojiId: emojiId,
        roleId: roleId,
        changable: changale,
      });

      updateButtons(message, messageId);

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
      const customId = interaction.options.getString("custom-id");

      const findButton =
        (await ButtonRole.findOne({
          guildId: interaction.guild.id,
          buttonCustomId: customId,
        })) || null;

      if (findButton === null)
        return interaction.reply({
          content: "Object Doesn't Exist",
          ephemeral: true,
        });

      const messageId = findButton.messageId;

      const message = await channel.messages?.fetch(messageId);

      if (!message)
        return interaction.reply({
          content: "Message Doesnt Exist",
          ephemeral: true,
        });

      await ButtonRole.deleteOne({
        guildId: interaction.guild.id,
        buttonCustomId: customId,
      });

      updateButtons(message, messageId);

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
