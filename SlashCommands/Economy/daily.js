const SlashCommand = require("../../Structures/SlashCommand.js");
const profileModel = require("../../DBModels/profileSchema.js");

module.exports = new SlashCommand({
  name: "daily",
  description: "💳 daily reward",
  cooldown: 3600 * 24,

  async run(interaction) {
    const randomNumber = Math.floor(Math.random() * (50 - 25) + 25);

    const profileData = await profileModel.findOneAndUpdate(
      { guildId: interaction.guildId, userID: interaction.user.id },
      { $inc: { BTUcoins: +randomNumber } },
      { upsert: true }
    );
    interaction.reply(`You Received Daily **${randomNumber}** BTU Coins`);
    return true;
  },
});
