const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "biden",
  description: "პრეზიდენტი Biden გამოაგზავნის Tweet-ს",
  type: "BOTH",
  options: [
    {
      type: "STRING",
      name: "input",
      description: "რა და-Tweet-ოს პრეზიდენტმა",
      required: true,
    },
  ],

  async run(message, args) {
    if (message.isCommand) {
      const text = args;
      const Image = `https://api.popcatdev.repl.co/biden?text=${encodeURIComponent(
        text
      )}`;
      message.followUp(Image);

    } else {
      const split = args.join(" ");
      const text = split;

      if (!text)
        return message.reply({
          contemt: "შეიყვანეთ წინადადება ან სიტყვა ბრძანების შემდეგ",
          ephemeral: true,
        });
      const Image = `https://api.popcatdev.repl.co/biden?text=${encodeURIComponent(
        text
      )}`;

      message.channel.send(Image);
    }
  },
});
