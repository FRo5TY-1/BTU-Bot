const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");
const ms = require("ms");
const { FeelsBadMan } = require("../../Data/emojis.json");

module.exports = new Command({
  name: "profile",
  description: "💳 Shows User's Profile",
  type: "SLASH",
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

    let profileData =
      (await profileModel.findOne({
        guildId: interaction.guild.id,
        userID: target.id,
      })) || null;

    if (profileData === null) {
      profileData = await profileModel.create({
        guildId: interaction.guild.id,
        userID: target.id,
      });
      profileData.save();
    }

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const streamTime = ms(profileData.streamTime * 1000, { long: true });

    embed
      .setTitle(`${interaction.user.username}'s Profile`)
      .setDescription(
        `BTU Coins: **${profileData.BTUcoins}**\nMusic Stream Time: **${streamTime}**`
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
