const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { Queue } = require("discord-player");

module.exports = new PlayerEvent(
  "queueEnd",
  /**
   * @param {Queue} queue
   */ async (client, queue) => {
    if (queue) {
      const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
      const embed = new Discord.MessageEmbed();

      embed
        .setDescription(
          "```✅ | Finished Playing, No More Songs In Queue\nLeaving The Channel In 3 Minutes If No Songs Are Added```"
        )
        .setColor("PURPLE")
        .setFooter({
          text: `BTU `,
          iconURL: "attachment://BTULogo.png",
        })
        .setTimestamp();

      queue?.metadata.send({ embeds: [embed], files: [Logo] });

      const timeout = setTimeout(() => {
        if (queue?.playing) return;
        embed.setDescription(
          "`Left The Channel And Destroyed The Queue Due To Inactivity`"
        );
        queue?.metadata.send({ embeds: [embed], files: [Logo] });
      }, 180000);

      client.musicTimeouts.set(queue.guild.id, timeout);
    }
  }
);
