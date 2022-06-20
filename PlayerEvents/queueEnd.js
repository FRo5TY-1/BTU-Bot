const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { Queue } = require("discord-player");

module.exports = new PlayerEvent(
  "queueEnd",
  /**
   * @param {Queue} queue
   */ async (client, queue) => {
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription("✅ | `Finished Playing And Left The Channel`")
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();
    queue.metadata.send({ embeds: [embed], files: [Logo] });
  }
);
