const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

let profileData;

module.exports = new Command({
  name: "embed",
  description: "make an embed",
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

    const embed = new Discord.MessageEmbed();

    embed.setTitle(title).setDescription(description);

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
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    interaction.followUp({ content: `Embed შეიქმნა და გაიგზავნა` });
    channel.send({ content: content, embeds: [embed] });
  },
});
