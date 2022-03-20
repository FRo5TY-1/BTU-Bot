const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event("guildMemberAdd", (client, member) => {
  const roleDeviderRole = "925812454011842650";
  member.roles.add(roleDeviderRole);

  const channel = member.guild.channels.cache.find(
    (c) => c.name == "🖐welcome"
  );

  if (!channel) return;

  const file = new Discord.MessageAttachment("Pictures/BTULogo.png");
  const embed = new Discord.MessageEmbed();

  embed
    .setTitle(
      "<a:PepeDance:924590592326000640> Welcome " +
        member.user.username +
        " ! <a:PepeDance:924590592326000640>"
    )
    .setDescription(
      "გაეცანი სერვერის წესებს  :point_right:<#913320728563167262>!" +
        "\nაგრეთვე აირჩიე როლები  :point_right:<#919298186877734952>!"
    )
    .setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL({ dynamic: true }),
    })
    .setColor("PURPLE")
    .setThumbnail("attachment://BTULogo.png")
    .setFooter({ text: "სალობიე " })
    .setTimestamp();

  channel.send({ embeds: [embed], files: [file] });
});
