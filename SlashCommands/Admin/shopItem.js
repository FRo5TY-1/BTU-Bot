const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const itemModel = require("../../DBModels/shopItemsSchema.js");

module.exports = new SlashCommand({
  name: "shop-item",
  permissions: ["ADMINISTRATOR"],
  description: "Add Or Remove A Button Role",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "Add An Item To Server Shop",
      options: [
        {
          type: "STRING",
          name: "rarity",
          description: "Choose Item Tier",
          required: true,
          choices: [
            { name: "Legendary", value: "legendary" },
            { name: "Epic", value: "epic" },
            { name: "Rare", value: "rare" },
            { name: "UnCommon", value: "uncommon" },
            { name: "Common", value: "common" },
          ],
        },
        {
          type: "STRING",
          name: "name",
          description: "Choose Item Name",
          required: true,
        },
        {
          type: "INTEGER",
          name: "price",
          description: "Choose Item Price",
          required: true,
          min_value: 10,
          max_value: 100000,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "Remove An Item From Server Shop",
      options: [
        {
          type: "STRING",
          name: "name",
          description: "Item Name",
          required: true,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getSubcommand() === "add") {
      const rarity = interaction.options.getString("rarity");
      const name = interaction.options.getString("name");
      const price = interaction.options.getInteger("price");
      const tier =
        rarity === "legendary"
          ? 1
          : rarity === "epic"
          ? 2
          : rarity === "rare"
          ? 3
          : rarity === "uncommon"
          ? 4
          : 5;

      if (name.length > 128)
        return interaction.reply({ content: "Name Too Long", ephemeral: true });

      const rarityItems = await itemModel.find({
        guildId: interaction.guild.id,
        rarity: rarity,
      });

      if (rarityItems.length > 5)
        return interaction.reply({
          content: "Only 5 Item Per Rariy Allowed",
          ephemeral: true,
        });

      const itemData = await itemModel.create({
        guildId: interaction.guild.id,
        tier: tier,
        rarity: rarity,
        name: name,
        price: price,
      });
      itemData.save();
      return interaction.reply({
        content: "Successfully Added Item To Shop",
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const name = interaction.options.getString("name");
      const item = await itemModel.find({
        guildId: interaction.guild.id,
        name: name,
      });

      if (!item.length)
        return interaction.reply({
          content: "Item Does Not Exist",
          ephemeral: true,
        });
      await itemModel.findOneAndDelete({
        guildId: interaction.guild.id,
        name: name,
      });
      return interaction.reply({
        content: "Successfully Removed Item From Shop",
        ephemeral: true,
      });
    }
  },
});
