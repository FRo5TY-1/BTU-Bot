const SlashCommand = require("../../Structures/SlashCommand");
const { Profile } = require("../../Database/index");

module.exports = new SlashCommand({
  name: "daily",
  description: "💳 daily reward",
  cooldown: 3600 * 24,

  async run(interaction) {
    const randomNumber = Math.floor(Math.random() * (50 - 25) + 25);

    await Profile.findOneAndUpdate(
      { guildId: interaction.guildId, userId: interaction.user.id },
      { $inc: { BTUcoins: +randomNumber } },
      { upsert: true }
    );
    interaction.reply(`You Received Daily **${randomNumber}** BTU Coins`);
    return true;
  },
});
