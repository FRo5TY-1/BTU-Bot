const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const cooldownModel = require("../../DBModels/cooldownsSchema.js");
const ms = require("ms");

module.exports = new Command({
  name: "daily",
  description: "daily reward",
  type: "SLASH",

  async run(interaction) {
    let profileData = await profileModel.findOne({ userID: interaction.user.id });

    let cooldownData = await cooldownModel.findOne({
      userID: interaction.user.id,
      command: "daily",
    });
    if (cooldownData) {
      let cooldownExpiry = cooldownData.expiry;
      if (cooldownExpiry > new Date().getTime()) {
        return interaction.followUp({
          content: `თქვენ უკვე გამოიყენეთ ეს ბრძანება, დარჩენილი დრო: **${ms(
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
          userID: interaction.user.id,
          BTUcoins: 500,
        });
        profileData.save();
      }

      const response = await profileModel.findOneAndUpdate(
        {
          userID: interaction.user.id,
        },
        {
          $inc: {
            BTUcoins: +randomNumber,
          },
        }
      );
      interaction.followUp(
        `თქვენ დაგერიცხათ დღიური **${randomNumber}** BTU Coin`
      );

      cooldownData = await cooldownModel.create({
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
