const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "biden",
  description: "პრეზიდენტი Biden გამოაგზავნის Tweet-ს",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "input",
      description: "რა და-Tweet-ოს პრეზიდენტმა",
      required: true,
    },
  ],

  async run(interaction, args) {
      const text = interaction.options.getString('input');
      const Image = `https://api.popcatdev.repl.co/biden?text=${encodeURIComponent(
        text
      )}`;
      interaction.followUp(Image);
  },
});
