const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const { FeelsBadMan } = require("../../Data/emojis.json");
const { Inventory } = require("../../Database/index");

module.exports = new SlashCommand({
  name: "inventory",
  description: "💳 ნახეთ თქვენი ან სხვისი inventory",
  options: [
    {
      type: "USER",
      name: "user",
      description: "სხვა მომხმარებლის inventory",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content: `Bots Don't Use Our Services ${FeelsBadMan.emoji}`,
      });

    await interaction.deferReply();

    const target =
      client.users.cache.get(interaction.options.getMember("user")?.id) ||
      interaction.user;
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`${target.username}'s Inventory`)
      .setAuthor({
        name: target.username,
        iconURL: target.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    const items = await Inventory.find({
      guildId: interaction.guild.id,
      userId: target.id,
    }).sort({ "item.tier": 1 });

    const itemsArray = items.map((item, i) => {
      const tierEmoji =
        item.tier == 1
          ? "🟠"
          : item.tier == 2
          ? "🔴"
          : item.tier == 3
          ? "🔵"
          : item.tier == 4
          ? "🟢"
          : "⚫";
      return `${tierEmoji} ${item.name} x ${item.amount}`;
    });

    embed.setDescription(
      `**\`\`\`${
        itemsArray.slice(0, 20).join("\n") || "This Page Is Empty"
      }\`\`\`**`
    );
    return interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
