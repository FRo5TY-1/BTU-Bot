const SlashCommand = require("../../Structures/SlashCommand.js");
const profileModel = require("../../DBModels/profileSchema.js");
const itemModel = require("../../DBModels/shopItemsSchema.js");
const inventoryModel = require("../../DBModels/inventorySchema.js");
const Discord = require("discord.js");
const {
  Expensive,
  LuffyDodge,
  RareCandy,
  Brokege,
  WojakDone,
} = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "shop",
  description: "💳 Shop Commands",
  options: [
    {
      name: "see",
      description: "💳 See The Shop",
      type: "SUB_COMMAND",
      options: [
        {
          name: "page",
          type: "INTEGER",
          description: "Choose Page",
          min_value: 1,
          max_value: 2,
          required: true,
        },
      ],
    },
    {
      name: "buy",
      description: "💳 Buy An Item From The Shop",
      type: "SUB_COMMAND",
      options: [
        {
          name: "item",
          description: "Index Of The Item You Wish To Purchase",
          type: "INTEGER",
          required: true,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");

    const items = await itemModel
      .find({
        guildId: interaction.guild.id,
      })
      .sort({ tier: 1, price: -1 });

    const sliceItems = items.map((i, index) => {
      return `${index + 1}. ${i.name} | ${i.price} BTU Coins`;
    });

    function filterItems(tier) {
      const tierEmoji =
        tier == 1
          ? "🟠"
          : tier == 2
          ? "🔴"
          : tier == 3
          ? "🔵"
          : tier == 4
          ? "🟢"
          : "⚫";
      return (
        items
          .filter((i) => i.tier === tier)
          .map((i) => {
            return `${tierEmoji} ${items.indexOf(i) + 1}. ${i.name} | ${
              i.price
            } BTU Coins`;
          })
          .join("\n") || "No Items"
      );
    }

    if (interaction.options.getSubcommand() === "see") {
      const page = interaction.options.getInteger("page");
      const embed = new Discord.MessageEmbed();
      embed
        .setDescription(
          "```  Use /shop buy [Item Index] To Purchase Item You Want  ```"
        )
        .setColor("PURPLE")
        .setFooter({
          text: `Page ${page}`,
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      if (page == 1) {
        embed.addFields(
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${Expensive.emoji}⠀Legendary⠀${Expensive.emoji} `,
            value: `\`\`\`${filterItems(1)}\`\`\``,
          },
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${LuffyDodge.emoji}⠀Epic⠀${LuffyDodge.emoji} `,
            value: `\`\`\`${filterItems(2)}\`\`\``,
          }
        );
      } else {
        embed.addFields(
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${RareCandy.emoji}⠀Rare⠀${RareCandy.emoji} `,
            value: `\`\`\`${filterItems(3)}\`\`\``,
          },
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${Brokege.emoji}⠀Uncommon⠀${Brokege.emoji} `,
            value: `\`\`\`${filterItems(4)}\`\`\``,
          },
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${WojakDone.emoji}⠀Common⠀${WojakDone.emoji} `,
            value: `\`\`\`${filterItems(5)}\`\`\``,
          }
        );
      }

      return interaction.reply({ embeds: [embed], files: [Logo] });
    } else {
      //buy sub command starts here

      const itemIndex = interaction.options.getInteger("item") - 1;

      if (!items[itemIndex])
        return interaction.reply({
          content: "Item With That Index Does Not Exist!",
          ephemeral: true,
        });

      const profileData = await profileModel.findOne({
        guildId: interaction.guild.id,
        userID: interaction.user.id,
      });

      const moneyBefore = profileData.BTUcoins;

      if (profileData.BTUcoins < items[itemIndex].price) {
        return interaction.reply({
          content: "Not Enough Funds",
        });
      } else {
        let itemData = await inventoryModel.findOne({
          guildId: interaction.guild.id,
          userID: interaction.user.id,
          item: items[itemIndex],
        });

        await profileModel.findOneAndUpdate(
          {
            guildId: interaction.guild.id,
            userID: interaction.user.id,
          },
          {
            $inc: {
              BTUcoins: -items[itemIndex].price,
            },
          }
        );

        if (itemData !== null) {
          await inventoryModel.findOneAndUpdate(
            {
              guildId: interaction.guild.id,
              userID: interaction.user.id,
              item: items[itemIndex],
            },
            {
              $inc: {
                amount: +1,
              },
            }
          );
        } else {
          itemData = await inventoryModel.create({
            guildId: interaction.guild.id,
            userID: interaction.user.id,
            item: items[itemIndex],
          });
          itemData.save();
        }

        const embed = new Discord.MessageEmbed();
        embed
          .setTitle("Success")
          .setDescription(
            `წარმატებით შეიძინეთ \`${items[itemIndex].name}\`
            \nძველი ბალანსი: \`${moneyBefore}\`, ახალი: \`${
              moneyBefore - items[itemIndex].price
            }\``
          )
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("PURPLE")
          .setFooter({
            text: "BTU ",
            iconURL: "attachment://BTULogo.png",
          })
          .setTimestamp();
        return interaction.reply({ embeds: [embed], files: [Logo] });
      }
    }
  },
});
