const Command = require("../../Structures/Command.js");
const itemModel = require("../../DBModels/itemSchema.js");
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
      return interaction.followUp({
        content:
          "Bot-ები არ მოიხმარენ ჩვენ სერვისს <:FeelsBadMan:924601273028857866>",
      });
    const target =
      client.users.cache.get(interaction.options.getMember("user")?.id) ||
      interaction.user;
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`${target.username}'s Inventory`)
      .setAuthor({
        name: target.username,
        iconURL: target.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: "BTU ",
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    const itemData = await itemModel
      .find({
        userID: target.id,
      })
      .sort([["itemTier", -1]])
      .exec((err, res) => {
        if (res.length < 1) {
          embed.setDescription("`Inventory ცარიელია`");
          return interaction.followUp({ embeds: [embed] });
        }

        const itemArray = [];

        for (i = 0; i < 15; i++) {
          if (!res[i]) continue;
          itemArray.push(`\`${res[i].itemName}\` x **${res[i].itemAmount}**`);
        }
        embed.setDescription(itemArray.join("\n"));
        return interaction.followUp({ embeds: [embed] });
      });
  },
});
