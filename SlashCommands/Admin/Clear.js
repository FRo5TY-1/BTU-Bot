const SlashCommand = require("../../Structures/SlashCommand.js");

module.exports = new SlashCommand({
  name: "clear",
  permissions: ["MANAGE_MESSAGES"],
  description: "Bulk Deletes Messages",
  options: [
    {
      name: "amount",
      description: "Amount To Be Deleted",
      type: "INTEGER",
      maxValue: 100,
      minValue: 2,
      required: false,
    },
  ],

  async run(interaction) {
    let amount = interaction.options.getInteger("amount") || 10;

    try {
      await interaction.channel.bulkDelete(amount);
    } catch (err) {
      return interaction.reply({
        content: "Messages Which Are Older Than 14 Days Can't Be Deleted",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Successfully Deleted ${amount} Messages`,
      ephemeral: true,
    });
  },
});
