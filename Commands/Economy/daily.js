const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const cooldownModel = require("../../DBModels/cooldownsSchema.js");
const ms = require("ms");
let profileData;
let cooldownExpiry;

module.exports = new Command({
  name: "daily",
  description: "daily reward",
  aliases: ["beg"],
  type: "BOTH",

  async run(message) {
    if (message.isCommand) {
      profileData = await profileModel.findOne({ userID: message.user.id });

      let cooldownData = await cooldownModel.findOne({
        userID: message.user.id,
        command: "daily",
      });
      if (cooldownData) {
        cooldownExpiry = cooldownData.expiry;
        if (cooldownExpiry > new Date().getTime()) {
          return message.followUp(
            `თქვენ უკვე გამოიყენეთ ეს ბრძანება, დარჩენილი დრო: **${ms(
              cooldownExpiry - new Date().getTime()
            )}**`
          );
        } else {
          cooldownData.remove({ userID: message.user.id, command: "daily" });
        }
      }

      randomNumber = Math.floor(Math.random() * (40 - 30) + 30);

      try {
        if (!profileData) {
          profileData = await profileModel.create({
            userID: message.user.id,
            BTUcoins: 500,
          });
          profileData.save();
        }

        const response = await profileModel.findOneAndUpdate(
          {
            userID: message.user.id,
          },
          {
            $inc: {
              BTUcoins: +randomNumber,
            },
          }
        );
        message.followUp(
          `თქვენ დაგერიცხათ დღიური **${randomNumber}** BTU Coin`
        );

        cooldownData = await cooldownModel.create({
          userID: message.user.id,
          command: "daily",
          expiry: new Date().getTime() + 3600000 * 24,
        });
        cooldownData.save();
      } catch (err) {
        console.log(err);
      }
    } else {
      profileData = await profileModel.findOne({ userID: message.author.id });

      let cooldownData = await cooldownModel.findOne({
        userID: message.author.id,
        command: "daily",
      });
      if (cooldownData) {
        cooldownExpiry = cooldownData.expiry;
        if (cooldownExpiry > new Date().getTime()) {
          return message.reply(
            `თქვენ უკვე გამოიყენეთ ეს ბრძანება, დარჩენილი დრო: **${ms(
              cooldownExpiry - new Date().getTime()
            )}**`
          );
        } else {
          cooldownData.remove({ userID: message.author.id, command: "daily" });
        }
      }

      randomNumber = Math.floor(Math.random() * (40 - 30) + 30);

      try {
        if (!profileData) {
          profileData = await profileModel.create({
            userID: message.author.id,
            BTUcoins: 500,
          });
          profileData.save();
        }

        const response = await profileModel.findOneAndUpdate(
          {
            userID: message.author.id,
          },
          {
            $inc: {
              BTUcoins: +randomNumber,
            },
          }
        );
        message.reply(`თქვენ დაგერიცხათ დღიური **${randomNumber}** BTU Coin`);

        cooldownData = await cooldownModel.create({
          userID: message.author.id,
          command: "daily",
          expiry: new Date().getTime() + 3600000 * 24,
        });
        cooldownData.save();
      } catch (err) {
        console.log(err);
      }
    }
  },
});
