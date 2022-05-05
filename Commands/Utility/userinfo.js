const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const ignoredRoles = ["@everyone", "ㅤ⊱─── { Gaming Roles } ───⊰ㅤㅤ"];

module.exports = new Command({
  name: "userinfo",
  description: "ნახეთ ინფორმაცია მომხმარებელზე",
  type: "SLASH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "მომხმარებელი ვისი ბალანსიც გაინტერესებთ",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getMember("user").roles.botRole)
      return interaction.reply({
        content:
          "Bot-ები არ მოიხმარენ ჩვენ სერვისს <:FeelsBadMan:924601273028857866>",
      });
    const target = client.users.cache.get(
      interaction.options.getMember("user").id
    );

    const created = `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`;
    const joined = `<t:${Math.floor(
      interaction.options.getMember("user").joinedAt / 1000
    )}:R>`;

    const member = await interaction.guild.members.fetch(target.id);
    const roles = member.roles.cache
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
      .setDescription(`**Information About** <@!${target.id}>`)
      .addFields(
        {
          name: `Username`,
          value: `**\`\`\` ${target.tag} \`\`\`**`,
          inline: true,
        },
        {
          name: `UserID`,
          value: `**\`\`\` ${target.id} \`\`\`**`,
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
        }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
