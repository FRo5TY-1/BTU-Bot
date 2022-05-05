const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "biden",
  description: "President Biden Will Send A Tweet",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "input",
      description: "Text That Biden Will Tweet",
      required: true,
    },
  ],

  async run(interaction, args) {
    const text = interaction.options.getString("input");
    const Image = `https://api.popcatdev.repl.co/biden?text=${encodeURIComponent(
      text
    )}`;
    interaction.reply(Image);
  },
});
