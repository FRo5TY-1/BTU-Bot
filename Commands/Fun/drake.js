const Command = require("../../Structures/Command.js");

module.exports = new Command({
  name: "drake",
  description: "შექმენით Drake Meme",
  type: "BOTH",
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

  async run(message, args) {
    if (message.isCommand) {
      const text1 = args[0];
      const text2 = args[1];
      const Image = `https://api.popcatdev.repl.co/drake?text1=${encodeURIComponent(
        text1
      )}&text2=${encodeURIComponent(text2)}`;

      message.followUp(Image);
    } else {
      const split = args.slice(0).join(" ").split("|");
      const text1 = split[0];
      const text2 = split[1];
      if (!text1 || !text2)
        return message.reply(
          "შეიყვანეთ |-ით დაცალკევებული 2 წინადადება ან სიტყვა"
        );
      const Image = `https://api.popcatdev.repl.co/drake?text1=${encodeURIComponent(
        text1
      )}&text2=${encodeURIComponent(text2)}`;

      message.channel.send(Image);
    }
  },
});
