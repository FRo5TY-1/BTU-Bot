const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");

module.exports = new Command({
  name: "pay",
  description: "მოახდინეთ BTU Coin-ების გადარიცხვა",
  type: "SLASH",
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

  async run(interaction, args) {
    let profileData = await profileModel.findOne({
      guildId: interaction.guild.id,
      userID: interaction.user.id,
    });

    if (!profileData) {
      profileData = await profileModel.create({
        guildId: interaction.guild.id,
        userID: interaction.user.id,
      });
      profileData.save();
    }
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content:
          "Bots Don't Use Our Services <:FeelsBadMan:924601273028857866>",
      });
    const target = client.users.cache.get(
      interaction.options.getMember("user")?.id
    );
    if (!target)
      return interaction.reply({
        content: "User Doesn't Exist!",
        ephemeral: true,
      });
    if (target.id === interaction.user.id)
      return interaction.reply({
        content: "Can't Pay Yourself!",
        ephemeral: true,
      });
    const amount = interaction.options.getInteger("amount");
    if (amount > profileData.BTUcoins)
      return interaction.reply({
        content: `Insufficent Funds!\nYour Balance: ${profileData.BTUcoinss}`,
        ephemeral: true,
      });
    const cutAmount = amount - amount * 0.02;

    try {
      let targetData = await profileModel.findOne({
        guildId: interaction.guild.id,
        userID: target.id,
      });
      if (!targetData) {
        targetData = await profileModel.create({
          guildId: interaction.guild.id,
          userID: target.id,
        });
        targetData.save();
      }

      await profileModel.findOneAndUpdate(
        {
          guildId: interaction.guild.id,
          userID: interaction.user.id,
        },
        {
          $inc: {
            BTUcoins: -amount,
          },
        }
      );

      await profileModel.findOneAndUpdate(
        {
          guildId: interaction.guild.id,
          userID: target.id,
        },
        {
          $inc: {
            BTUcoins: +cutAmount,
          },
        }
      );

      return interaction.reply({
        content: `Transaction Ended Successfully, **${amount}** BTU Coins Were Taken From Your Account\n${target.username} Received **${cutAmount}** BTU Coins`,
      });
    } catch (err) {
      console.log(err);
    }
  },
});
