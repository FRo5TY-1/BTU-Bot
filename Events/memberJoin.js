const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event("guildMemberAdd", (client, member) => {
  const roleDeviderRole = "925812454011842650";
  member.roles.add(roleDeviderRole);

  const channel = member.guild.channels.cache.find(
    (c) => c.name == "🖐welcome"
  );

  if (!channel) return;

  const embed = new Discord.MessageEmbed();

  embed
    .setTitle(
      ` Welcome ${member.user.username} ! `
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
    .setFooter({
      text: "BTU ",
      iconURL:
        "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
    })
    .setTimestamp();

  channel.send({ embeds: [embed], files: [file] });
});
