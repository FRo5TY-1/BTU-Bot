const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const cooldownModel = require("../../DBModels/cooldownsSchema.js");
const ms = require("ms");

module.exports = new Command({
  name: "daily",
  description: "💳 daily reward",
  type: "SLASH",

  async run(interaction) {
    let profileData = await profileModel.findOne({
      guildId: interaction.guild.id,
      userID: interaction.user.id,
    });

    let cooldownData = await cooldownModel.findOne({
      guildId: interaction.guild.id,
      userID: interaction.user.id,
      command: "daily",
    });
    if (cooldownData) {
      let cooldownExpiry = cooldownData.expiry;
      if (cooldownExpiry > new Date().getTime()) {
        return interaction.reply({
          content: `You Already Used This Command, Time Left: **${ms(
            cooldownExpiry - new Date().getTime()
          )}**`,
        });
      } else {
        cooldownData.remove({ userID: interaction.user.id, command: "daily" });
      }
    }

    randomNumber = Math.floor(Math.random() * (40 - 30) + 30);

    try {
      if (!profileData) {
        profileData = await profileModel.create({
          guildId: interaction.guild.id,
          userID: interaction.user.id,
        });
        profileData.save();
      }

      const response = await profileModel.findOneAndUpdate(
        {
          guildId: interaction.guild.id,
          userID: interaction.user.id,
        },
        {
          $inc: {
            BTUcoins: +randomNumber,
          },
        }
      );
      interaction.reply(`You Received Daily **${randomNumber}** BTU Coins`);

      cooldownData = await cooldownModel.create({
        guildId: interaction.guild.id,
        userID: interaction.user.id,
        command: "daily",
        expiry: new Date().getTime() + 3600000 * 24,
      });
      cooldownData.save();
    } catch (err) {
      console.log(err);
    }
  },
});
