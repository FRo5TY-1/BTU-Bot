const Command = require("../../Structures/Command.js");
const inventoryModel = require("../../DBModels/inventorySchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "inventory",
  description: "ნახეთ თქვენი ან სხვისი inventory",
  type: "SLASH",
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
        content:
          "Bots Don't Use Our Services <:FeelsBadMan:924601273028857866>",
      });
    const target =
      client.users.cache.get(interaction.options.getMember("user")?.id) ||
      interaction.user;
    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
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

    inventoryModel
      .find({
        guildId: interaction.guild.id,
        userID: target.id,
      })
      .sort({ "item.tier": 1 })
      .exec((err, res) => {
        if (res.length < 1) {
          embed.setDescription("```Inventory Is Empty```");
          return interaction.reply({ embeds: [embed], files: [Logo] });
        }

        const itemArray = [];

        for (i = 0; i < 15; i++) {
          if (!res[i]) continue;
          const tierEmoji =
            res[i].item.tier == 1
              ? "🟠"
              : res[i].item.tier == 2
              ? "🔴"
              : res[i].item.tier == 3
              ? "🔵"
              : res[i].item.tier == 4
              ? "🟢"
              : "⚫";
          itemArray.push(`${tierEmoji} ${res[i].item.name} x ${res[i].amount}`);
        }
        embed.setDescription(`**\`\`\`${itemArray.join("\n")}\`\`\`**`);
        return interaction.reply({ embeds: [embed], files: [Logo] });
      });
  },
});
