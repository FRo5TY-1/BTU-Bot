const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "drake",
  description: "შექმენით Drake Meme",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "text1",
      description: "ტექსტი რომელსაც Drake უარყოფს",
      required: true,
    },
    {
      type: "STRING",
      name: "text2",
      description: "ტექსტი რომელსაც Drake ეთანხმება",
      required: true,
    },
  ],

  async run(interaction, args) {
      const text1 = interaction.options.getString('text1');
      const text2 = interaction.options.getString('text2');
      const Image = `https://api.popcatdev.repl.co/drake?text1=${encodeURIComponent(
        text1
      )}&text2=${encodeURIComponent(text2)}`;

      interaction.followUp(Image);
  },
});
