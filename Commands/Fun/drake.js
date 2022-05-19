const Command = require("../../Structures/Command.js");
const { createCanvas, Image } = require("@napi-rs/canvas");
const { readFile } = require("fs/promises");
const { MessageAttachment } = require("discord.js");

module.exports = new Command({
  name: "drake",
  description: "Create A Drake Meme",
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

    const canvas = createCanvas(795, 795);
    const context = canvas.getContext("2d");

    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, 795, 795);

    const drakeNo = await readFile("./Pictures/MemeTemplates/DrakeNo.jpg");
    const drakeNoImage = new Image();
    drakeNoImage.src = drakeNo;
    context.drawImage(drakeNoImage, 5, 5, 390, 390);
    context.stroke();

    const drakeYes = await readFile("./Pictures/MemeTemplates/DrakeYes.jpg");
    const drakeYesImage = new Image();
    drakeYesImage.src = drakeYes;
    context.drawImage(drakeYesImage, 5, 400, 390, 390);

    context.fillStyle = "#ffffff";
    context.fillRect(400, 5, 390, 390);
    context.fillRect(400, 400, 390, 390);

    function splitText(ctx, text, x, y, maxW, lHeight) {
      const words = text.split(" ");
      let line = "";
      ctx.font = "32px sans-serif";
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

    splitText(context, text1, 410, 35, 380, 30);
    splitText(context, text2, 410, 430, 380, 30);

    const attachment = new MessageAttachment(
      canvas.toBuffer("image/png"),
      "profile-image.png"
    );

    interaction.reply({ files: [attachment] });
  },
});
