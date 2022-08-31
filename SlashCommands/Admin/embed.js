const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");

module.exports = new SlashCommand({
  name: "embed",
  description: "Make An Embed",
  permissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "STRING",
      name: "title",
      description: "Title",
      required: true,
    },
    {
      type: "STRING",
      name: "description",
      description: "Description",
      required: true,
    },
    {
      type: "CHANNEL",
      name: "channel",
      description: "Which Channel To Send In",
      required: true,
      channelTypes: ["GUILD_TEXT"],
    },
    {
      type: "USER",
      name: "author",
      description: "Embed Author",
      required: false,
    },
    {
      type: "STRING",
      name: "footer",
      description: "Footer",
      required: false,
    },
    {
      type: "STRING",
      name: "content",
      description: "Content",
      required: false,
    },
    {
      type: "STRING",
      name: "field1",
      description:
        "Seperate Value And Name With ^, write 'true' at the end to make the field inline",
      required: false,
    },
    {
      type: "STRING",
      name: "field2",
      description:
        "Seperate Value And Name With ^, write 'true' at the end to make the field inline",
      required: false,
    },
    {
      type: "STRING",
      name: "field3",
      description:
        "Seperate Value And Name With ^, write 'true' at the end to make the field inline",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const footer = interaction.options.getString("footer") || "BTU ";
    const content = interaction.options.getString("content") || " ";
    const target =
      client.users.cache.get(interaction.options.getMember("author")?.id) ||
      null;
    const channel = interaction.options.getChannel("channel");
    const field1 = interaction.options.getString("field1");
    const field2 = interaction.options.getString("field2");
    const field3 = interaction.options.getString("field3");

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed.setTitle(title).setDescription(description.replaceAll("|", "\n"));

    if (target !== null) {
      embed.setAuthor({
        name: target.username,
        iconURL: target.displayAvatarURL({ dynamic: true }),
      });
    }

    embed
      .setColor("PURPLE")
      .setFooter({
        text: footer,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    if (field1) {
      if (field1.slice(-4).toLowerCase() === "true") {
        inline = true;
        splitField = field1.slice(0, -4).replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      } else {
        inline = false;
        splitField = field1.replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      }
    }
    if (field2) {
      if (field2.slice(-4).toLowerCase() === "true") {
        inline = true;
        splitField = field2.slice(0, -4).replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      } else {
        inline = false;
        splitField = field2.replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      }
    }
    if (field3) {
      if (field3.slice(-4).toLowerCase() === "true") {
        inline = true;
        splitField = field3.slice(0, -4).replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      } else {
        inline = false;
        splitField = field3.replaceAll("|", "\n").split("^");
        embed.addField(splitField[0], splitField[1], inline);
      }
    }

    interaction.reply({
      content: `Embed Sent Successfully`,
      ephemeral: true,
    });
    channel.send({
      content: content.replaceAll("|", "\n"),
      embeds: [embed],
      files: [Logo],
    });
  },
});
