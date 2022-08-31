const ContextMenu = require("../Structures/ContextMenu.js");
const { Profile } = require("../Database/index");
const { FeelsBadMan } = require("../Data/emojis.json");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = new ContextMenu({
  name: "Profile",
  type: "USER",

  /**
   * @param {Discord.UserContextMenuInteraction} interaction
   */
  async run(interaction, client) {
    if (interaction.targetUser.bot)
      return interaction.reply({
        content: `Bots Don't Use Our Services ${FeelsBadMan.emoji}`,
        ephemeral: true,
      });

    const profileData = await Profile.findOne({
      guildId: interaction.guildId,
      userID: interaction.targetId,
    });

    if (!profileData) return interaction.reply({ content: "User Not Found" });

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const streamTime = ms(profileData.streamTime * 1000, { long: true });

    embed
      .setTitle(`${interaction.user.username}'s Profile`)
      .setDescription(
        `**\`\`\`Email: ${profileData.email}\nBTU Coins: ${profileData.BTUcoins}\nMusic Stream Time: ${streamTime}\`\`\`**`
      )
      .setAuthor({
        name: interaction.targetUser.username,
        iconURL: interaction.targetUser.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed], files: [Logo] });
  },
});
