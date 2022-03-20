const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const { Interaction } = require("discord.js");
const interactionCreate = require("../../Events/interactionCreate.js");
let profileData;
let targetData;

module.exports = new Command({
  name: "pay",
  description: "მოახდინეთ BTU Coin-ების გადარიცხვა",
  aliases: ["give"],
  type: "BOTH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "მომხმარებელი ვისთანაც გადარიცხვა გსურთ",
      required: true,
    },
    {
      type: "INTEGER",
      name: "amount",
      description: "თანხის ოდენობა მთელ რიცხვებში",
      required: true,
      minValue: 10,
    },
  ],

  async run(message, args) {
    if (message.isCommand) {
      profileData = await profileModel.findOne({ userID: message.user.id });

      if (!profileData) {
        profileData = await profileModel.create({
          userID: message.user.id,
          BTUcoins: 500,
        });
        profileData.save();
      }

      const target = message.options.getMember("user");
      if (!target)
        return message.followUp({
          content: "მომხმარებელი არ არსებობს!",
          ephemeral: true,
        });
      if (target.id === message.user.id)
        return message.followUp({
          content: "საკუთარ თავს ვერ გადაურიცხავთ!",
          ephemeral: true,
        });
      if (target.roles.botRole)
        return message.followUp({
          content: "Bot-ებს ვერ გადაურიცხავთ!",
          ephemeral: true,
        });
      const amount = message.options.getInteger('amount');
      if (amount % 1 != 0 || amount <= 0)
        return message.followUp({
          content: "მიუთითეთ მთელი დადებით რიცხვი",
          ephemeral: true,
        });
      if (amount > profileData.BTUcoins)
        return message.followUp({
          content: `თქვენ არ გაქვთ ${amount} BTU Coin`,
          ephemeral: true,
        });
      const cutAmount = amount - amount * 0.02;

      try {
        targetData = await profileModel.findOne({ userID: target.id });
        if (!targetData) {
          targetData = await profileModel.create({
            userID: target.id,
            BTUcoins: 500,
          });
          targetData.save();
        }

        let send = await profileModel.findOneAndUpdate(
          {
            userID: message.user.id,
          },
          {
            $inc: {
              BTUcoins: -amount,
            },
          }
        );

        let recieve = await profileModel.findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              BTUcoins: +cutAmount,
            },
          }
        );

        return message.followUp({
          content: `ტრანზაქცია წარმატებით დასრულდა, თქვენ ჩამოგეჭრათ **${amount}** BTU Coin, და ${target.username}-ს ჩაერიცხა **${cutAmount}** BTU Coin`,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      profileData = await profileModel.findOne({ userID: message.author.id });

      if (!profileData) {
        profileData = await profileModel.create({
          userID: message.author.id,
          BTUcoins: 500,
        });
        profileData.save();
      }

      if (!args.length)
        return message.reply(
          "მიუთითეთ მომხმარებელი ვისთანაც გსურთ გადარიცხვა @-ით და რაოდენობა!"
        );

      const target = message.mentions.members.first();
      if (!target) return message.reply("მომხმარებელი არ არსებობს!");
      if (target.id === message.author.id)
        return message.reply("საკუთარ თავს ვერ გადაურიცხავთ!");
      if (target.roles.botRole)
        return message.reply("Bot-ებს ვერ გადაურიცხავთ!");
      const amount = Number(args[1]);
      if (amount % 1 != 0 || amount <= 0)
        return message.reply("მიუთითეთ მთელი დადებით რიცხვი");
      if (amount > profileData.BTUcoins)
        return message.reply(`თქვენ არ გაქვთ ${amount} BTU Coin`);
      const cutAmount = amount - amount * 0.02;

      try {
        targetData = await profileModel.findOne({ userID: target.id });
        if (!targetData) {
          targetData = await profileModel.create({
            userID: target.id,
            BTUcoins: 500,
          });
          targetData.save();
        }

        let send = await profileModel.findOneAndUpdate(
          {
            userID: message.author.id,
          },
          {
            $inc: {
              BTUcoins: -amount,
            },
          }
        );

        let recieve = await profileModel.findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              BTUcoins: +cutAmount,
            },
          }
        );

        return message.channel.send(
          `ტრანზაქცია წარმატებით დასრულდა, თქვენ ჩამოგეჭრათ **${amount}** BTU Coin, და ${target.username}-ს ჩაერიცხა **${cutAmount}** BTU Coin`
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
});
