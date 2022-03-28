const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");

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
      return interaction.followUp({
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
      .map((r) => `${r.name}`)
      .join("\n")
      .replace("@everyone", "")
      .replace("ㅤ⊱─── { Gaming Roles } ───⊰ㅤㅤ", "")
      .trimEnd();

    const embed = new Discord.MessageEmbed()
      .setTitle(`Information About ${interaction.user.username}`)
      .addFields(
        {
          name: `UserName`,
          value: `**\`\`\` ${target.tag} \`\`\`**`,
          inline: true,
        },
        {
          name: `UserID`,
          value: `**\`\`\` ${target.id} \`\`\`**`,
          inline: true,
        },
        {
          name: `Roles`,
          value: `**\`\`\`${roles}\`\`\`**`,
        },
        {
          name: `Account Created`,
          value: `**${created}**`,
          inline: true,
        },
        {
          name: `Joined Server`,
          value: `**${joined}**`,
          inline: true,
        }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL:
          "https://media.discordapp.net/attachments/951926364221607936/955116148540731432/BTULogo.png",
      })
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });
  },
});
