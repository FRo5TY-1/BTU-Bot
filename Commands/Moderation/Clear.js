const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "clear",
  showHelp: false,
  permissions: ["MANAGE_MESSAGES"],
  description: "Bulk Deletes Messages",
  type: "SLASH",
  options: [
    {
      name: "amount",
      description: "რამდენი მესიჯის წაშლა გსურთ",
      type: "INTEGER",
      maxValue: 100,
      minValue: 2,
      required: false,
    },
  ],

  async run(interaction) {
    let amount = interaction.options.getInteger("amount") || 10;

    interaction.channel.bulkDelete(amount).catch((err) => {
      interaction.followUp({
        content:
          "ვერ წავშლი მესიჯებს რომლებიც 14 ან მეტი დღის წინაა გამოგზავნილი",
        ephemeral: true,
      });
    });
  },
});
