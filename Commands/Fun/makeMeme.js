const Command = require("../../Structures/Command.js");
const { Image, createCanvas } = require("@napi-rs/canvas");
const { MessageAttachment } = require("discord.js");
const { default: axios } = require("axios");

module.exports = new Command({
  name: "make-meme",
  description: "Create A Meme With A Text On Top",
  type: "SLASH",
  options: [
    {
      type: "ATTACHMENT",
      name: "image",
      description: "Upload An Image",
      required: true,
    },
    {
      type: "STRING",
      name: "text",
      description: "Text To Be Displayed On Top Of Image",
      required: true,
    },
  ],

  async run(interaction, args) {
    await interaction.deferReply();
    const image = interaction.options.getAttachment("image");
    const text = interaction.options.getString("text");

    if (image.contentType.slice(0, 5) != "image")
      return interaction.followUp({ content: "Please Upload An Image" });

    const meme = await axios.get(image.url, { responseType: "arraybuffer" });

    const canvas = createCanvas(image.width, image.height * 1.2);

    const context = canvas.getContext("2d");
    const height20 = canvas.height * 0.2;
    const height80 = canvas.height * 0.8;
    const fontSize = canvas.width * 0.045;

    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ffffff";
    context.fillRect(2, 2, canvas.width - 4, height20 - 4);
    context.fillRect(2, height20, canvas.width - 4, height80 - 2);

    const memeImage = new Image();
    memeImage.src = Buffer.from(meme.data);
    context.drawImage(memeImage, 2, height20, canvas.width - 4, height80 - 2);

    function splitText(ctx, text, x, y, maxW, lHeight) {
      const words = text.split(" ");
      let line = "";
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "#000000";
      for (const [i, w] of words.entries()) {
        const testLine = line + w + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxW && i > 0) {
          ctx.fillText(line, x, y);
          line = w + " ";
          y += lHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    splitText(context, text, 4, fontSize + 2, canvas.width - 8, fontSize);

    const attachment = new MessageAttachment(
      canvas.toBuffer("image/png"),
      "meme.png"
    );

    interaction.followUp({ files: [attachment] });
  },
});
