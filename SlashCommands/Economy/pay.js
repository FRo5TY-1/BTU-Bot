const SlashCommand = require("../../Structures/SlashCommand.js");
const { Profile } = require("../../Database/index");
const { FeelsBadMan } = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "pay",
  description: "💳 მოახდინეთ BTU Coin-ების გადარიცხვა",
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

  async run(interaction, args, client) {
    let profileData = await Profile.findOne({
      guildId: interaction.guildId,
      userId: interaction.user.id,
    });

    if (!profileData) {
      profileData = await Profile.create({
        guildId: interaction.guild.id,
        userId: interaction.user.id,
      });
      profileData.save();
    }

    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content: `Bots Don't Use Our Services ${FeelsBadMan.emoji}`,
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
    if (amount > profileData?.BTUcoins)
      return interaction.reply({
        content: `Insufficent Funds!\nYour Balance: ${profileData.BTUcoins}`,
        ephemeral: true,
      });
    const cutAmount = amount - amount * 0.02;

    await Profile.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
        userId: interaction.user.id,
      },
      {
        $inc: {
          BTUcoins: -amount,
        },
      },
      { upsert: true }
    );

    await Profile.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
        userId: target.id,
      },
      {
        $inc: {
          BTUcoins: +cutAmount,
        },
      },
      { upsert: true }
    );

    return interaction.reply({
      content: `Transaction Ended Successfully, **${amount}** BTU Coins Were Taken From Your Account\n${target.username} Received **${cutAmount}** BTU Coins`,
    });
  },
});
