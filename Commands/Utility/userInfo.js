const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const emojis = require("../../Data/emojis.json")
const ignoredRoles = ["@everyone", "ㅤ⊱─── { Gaming Roles } ───⊰ㅤㅤ"];

module.exports = new Command({
  name: "user-info",
  description: "Get Information On User",
  type: "SLASH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "User To Check",
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content:
          `Bot's Don't Use Our Services ${emojis.FeelsBadMan}`,
      });
    const member = interaction.options.getMember("user") || interaction.member;
    const user = member.user;

    const created = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
    const joined = `<t:${Math.floor(member.joinedAt / 1000)}:R>`;

    const fetchMember = await interaction.guild.members.fetch(user.id);
    const roles = fetchMember.roles.cache
      .map((r) => {
        if (ignoredRoles.includes(r.name)) return null;
        return `${r.name}`;
      })
      .filter((element) => {
        return element != null;
      })
      .slice(0, 10)
      .join("\n");

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed()
      .setDescription(`<@!${user.id}>'s Profile`)
      .addFields(
        {
          name: `Username`,
          value: `**\`\`\` ${user.tag} \`\`\`**`,
          inline: true,
        },
        {
          name: `UserID`,
          value: `**\`\`\` ${user.id} \`\`\`**`,
          inline: true,
        },
        {
          name: `Up To 10 Roles`,
          value: `**\`\`\`${roles || "None"}\`\`\`**`,
        },
        {
          name: `Account Created`,
          value: `**${created}**`,
          inline: true,
        },
        {
          name: `Joined The Server`,
          value: `**${joined}**`,
          inline: true,
        },
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
