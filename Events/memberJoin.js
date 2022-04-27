const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event("guildMemberAdd", (client, member) => {
  const channel = member.guild.channels.cache.find(
    (c) => c.name == "🖐welcome"
  );

  if (!channel) return;

  const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
  const Banner = new Discord.MessageAttachment("./Pictures/WelcomeBanner.png");
  const embed = new Discord.MessageEmbed();

  embed
    .setTitle(`\`\`\`Welcome To BTU ${member.user.username} ! \`\`\``)
    .setDescription(
      "გაეცანი სერვერის წესებს  👉 <#913320728563167262>!\nაგრეთვე აირჩიე როლები 👉 <#919298186877734952>!"
    )
    .setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL({ dynamic: true }),
    })
    .setColor("PURPLE")
    .setImage("attachment://WelcomeBanner.png")
    .setFooter({
      text: `BTU `,
      iconURL: "attachment://BTULogo.png",
    })
    .setTimestamp();

  channel.send({ embeds: [embed], files: [Logo, Banner] });
});
