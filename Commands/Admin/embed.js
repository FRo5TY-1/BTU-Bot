const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "embed",
  description: "make an embed",
  showHelp: false,
  type: "SLASH",
  permissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "STRING",
      name: "title",
      description: "Embed-ის Title",
      required: true,
    },
    {
      type: "STRING",
      name: "description",
      description: "Embed-ის description",
      required: true,
    },
    {
      type: "CHANNEL",
      name: "channel",
      description: "რომელ Channel-ში გაიგზავნოს embed",
      required: true,
    },
    {
      type: "USER",
      name: "author",
      description: "Embed-ის author",
      required: false,
    },
    {
      type: "STRING",
      name: "footer",
      description: "Embed-ის footer",
      required: false,
    },
    {
      type: "STRING",
      name: "content",
      description: "მესიჯი Embed-ის წინ",
      required: false,
    },
    {
      type: "STRING",
      name: "field1",
      description: "Embed-ის Field, Name და Value გამოყავით ^-ით",
      required: false,
    },
    {
      type: "STRING",
      name: "field2",
      description: "Embed-ის Field, Name და Value გამოყავით ^-ით",
      required: false,
    },
    {
      type: "STRING",
      name: "field3",
      description: "Embed-ის Field, Name და Value გამოყავით ^-ით",
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
    const field1 = interaction.options.getString("field1") || null;
    const field2 = interaction.options.getString("field2") || null;
    const field3 = interaction.options.getString("field3") || null;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
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

    if (field1 !== null) {
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
    if (field2 !== null) {
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
    if (field3 !== null) {
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

    interaction.followUp({ content: `Embed შეიქმნა და გაიგზავნა` });
    channel.send({ content: content, embeds: [embed], files: [Logo] });
  },
});
