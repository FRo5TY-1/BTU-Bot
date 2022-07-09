const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event(
  "guildDelete",
  /** @param {Discord.Guild} guild */ (client, guild) => {
    const channel = client.channels.cache.get("925011460541788201");

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle("Bot Left A Server")
      .setDescription(
        `Server Name: **${guild.name}**\nServer ID: **${guild.id}**\nServer Owner: <@!${guild.ownerId}>`
      )
      .setThumbnail(guild.iconURL())
      .setImage(guild.bannerURL())
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setColor("PURPLE")
      .setTimestamp();

    return channel?.send({ embeds: [embed], files: [Logo] });
  }
);
