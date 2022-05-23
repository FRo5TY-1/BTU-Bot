const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const ms = require("ms");
const userStatsModel = require("../../DBModels/userStatsSchema.js");

const ignoredRoles = ["@everyone", "ㅤ⊱─── { Gaming Roles } ───⊰ㅤㅤ"];

module.exports = new Command({
  name: "profile",
  description: "Check Your Or Someone Else's Profile",
  type: "SLASH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "Check An User's Profile",
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content:
          "Bot's Don't Use Our Services <:FeelsBadMan:924601273028857866>",
      });
    const member = interaction.options.getMember("user") || interaction.member;
    const user = member.user;

    const voiceState = await userStatsModel.findOne({
      id: user.id,
      guildid: interaction.guild.id,
    });

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
        {
          name: `Music Stream Time`,
          value: `\`\ ${ms(voiceState?.seconds * 1000 || 0, { long: true, })}\ \``,
          inline: true,
        }
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
