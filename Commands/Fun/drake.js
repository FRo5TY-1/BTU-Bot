const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "drake",
  description: "Create Drake Meme",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "text1",
      description: "Text Which Drake Will Deny",
      required: true,
    },
    {
      type: "STRING",
      name: "text2",
      description: "Text Which Drake Will Approve",
      required: true,
    },
  ],

  async run(interaction, args) {
    const text1 = interaction.options.getString("text1");
    const text2 = interaction.options.getString("text2");
    const Image = `https://api.popcatdev.repl.co/drake?text1=${encodeURIComponent(
      text1
    )}&text2=${encodeURIComponent(text2)}`;

    interaction.followUp(Image);
  },
});
