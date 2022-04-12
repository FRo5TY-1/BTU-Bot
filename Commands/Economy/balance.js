const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "balance",
  description: "shows user's balance",
  type: "SLASH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "მომხმარებელი ვისი ბალანსიც გაინტერესებთ",
      required: false,
    },
  ],

  async run(interaction, args,client) {
    if (interaction.options.getMember("user")?.roles.botRole)
      return interaction.followUp({
        content:
          "Bot-ები არ მოიხმარენ ჩვენ სერვისს <:FeelsBadMan:924601273028857866>",
      });
    const target =
      client.users.cache.get(interaction.options.getMember("user")?.id) ||
      interaction.user;

    let profileData = (await profileModel.findOne({ userID: target.id })) || null;

    if (profileData === null) {
      profileData = await profileModel.create({
        userID: target.id,
        BTUcoins: 500,
      });
      profileData.save();
    }

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`${interaction.user.username}'s Balance`)
      .setDescription(`BTU Coins: **${profileData.BTUcoins}**`)
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

    interaction.followUp({ embeds: [embed], files: [Logo] });
  },
});
