const Command = require("../../Structures/Command.js");
const profileModel = require("../../DBModels/profileSchema.js");
const Discord = require("discord.js");

let profileData;

module.exports = new Command({
  name: "balance",
  description: "shows user's balance",
  aliases: ["bal", "money"],
  type: "BOTH",
  options: [
    {
      type: "USER",
      name: "user",
      description: "მომხმარებელი ვისი ბალანსიც გაინტერესებთ",
      required: false,
    },
  ],

  async run(message, args, client) {
    if (message.isCommand) {
      //slash command execution
      const value = message.options.getMember("user");
      let target;
      if (value) target = client.users.cache.get(value.id);
      const file = new Discord.MessageAttachment("Pictures/BTULogo.png");
      if (target) {
        profileData = await profileModel.findOne({ userID: target.id });

        if (!profileData) {
          profileData = await profileModel.create({
            userID: target.id,
            BTUcoins: 500,
          });
          profileData.save();
        }

        embed1 = new Discord.MessageEmbed()
          .setColor("PURPLE")
          .setDescription(`BTU Coins: **${profileData.BTUcoins}**`)
          .setAuthor({
            name: target.username,
            iconURL: target.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail("attachment://BTULogo.png");

        return message.followUp({ embeds: [embed1], files: [file] });
      }

      profileData = await profileModel.findOne({ userID: message.user.id });

      try {
        if (!profileData) {
          profileData = await profileModel.create({
            userID: message.user.id,
            BTUcoins: 500,
          });
          profileData.save();
        }
      } catch (err) {
        console.log(err);
      }

      const embed2 = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription(`BTU Coins: **${profileData.BTUcoins}**`)
        .setAuthor({
          name: message.user.username,
          iconURL: message.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail("attachment://BTULogo.png");

      message.followUp({ embeds: [embed2], files: [file] });
    } else {
      //text command execution
      const file = new Discord.MessageAttachment("Pictures/BTULogo.png");
      const target = message.mentions.users.first();
      if (target) {
        profileData = await profileModel.findOne({ userID: target.id });

        if (!profileData) {
          profileData = await profileModel.create({
            userID: target.id,
            BTUcoins: 500,
          });
          profileData.save();
        }

        embed1 = new Discord.MessageEmbed()
          .setColor("PURPLE")
          .setDescription(`BTU Coins: **${profileData.BTUcoins}**`)
          .setAuthor({
            name: target.username,
            iconURL: target.displayAvatarURL({ dynamic: true }),
            url: target.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail("attachment://BTULogo.png");

        return message.channel.send({ embeds: [embed1], files: [file] });
      }

      profileData = await profileModel.findOne({ userID: message.author.id });

      try {
        if (!profileData) {
          profileData = await profileModel.create({
            userID: message.author.id,
            BTUcoins: 500,
          });
          profileData.save();
        }
      } catch (err) {
        console.log(err);
      }

      const embed2 = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription(`BTU Coins: **${profileData.BTUcoins}**`)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
          url: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail("attachment://BTULogo.png");

      message.channel.send({ embeds: [embed2], files: [file] });
    }
  },
});
