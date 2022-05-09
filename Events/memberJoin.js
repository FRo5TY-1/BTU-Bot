const Event = require("../Structures/Event.js");
const Discord = require("discord.js");

module.exports = new Event(
  "guildMemberAdd",
  /** @param {Discord.GuildMember} member */ (client, member) => {
    const welcomeChannel = member.guild.channels.cache.find(
      (c) => /welcome/i.test(c.name) && c.isText()
    );
    const rulesChannel = member.guild.channels.cache.find(
      (c) => /rules/i.test(c.name) && c.isText()
    )?.id;
    const rolesChannel = member.guild.channels.cache.find(
      (c) => /roles/i.test(c.name) && c.isText()
    )?.id;

    if (!channel) return;

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const Banner = new Discord.MessageAttachment(
      "./Pictures/WelcomeBanner.png"
    );
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`\`\`\`Welcome To BTU ${member.user.username} ! \`\`\``)
      .setDescription(
        `გაეცანი სერვერის წესებს  👉 <#${rulesChannel}>!\nაგრეთვე აირჩიე როლები 👉 <#${rolesChannel}>!`
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

    welcomeChannel?.send({ embeds: [embed], files: [Logo, Banner] });
  }
);
