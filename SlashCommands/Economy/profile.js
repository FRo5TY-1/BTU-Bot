const SlashCommand = require("../../Structures/SlashCommand.js");
const { Profile } = require("../../Database/index");
const Discord = require("discord.js");
const ms = require("ms");
const { FeelsBadMan } = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "profile",
  description: "💳 Shows User's Profile",
  options: [
    {
      type: "USER",
      name: "user",
      description: "User To Be Shown",
      required: false,
    },
  ],

  async run(interaction, args, client) {
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.reply({
        content: `Bots Don't Use Our Services ${FeelsBadMan.emoji}`,
      });
    const target =
      client.users.cache.get(interaction.options.getMember("user")?.id) ||
      interaction.user;

    const profileData = await Profile.findOne({
      guildId: interaction.guild.id,
      userId: target.id,
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
        name: target.username,
        iconURL: target.displayAvatarURL({ dynamic: true }),
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
