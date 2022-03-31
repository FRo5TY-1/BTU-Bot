const Command = require("../../Structures/Command.js");
const tempChannelModel = require("../../DBModels/tempChannelsSchema.js");
const Discord = require("discord.js");
const ms = require("ms");
let channelExpiry;
let channelId;
let getChannel;
let channelTypeDB;

module.exports = new Command({
  name: "tempchannel",
  description: "შექმნეით channel რომელიც წაიშლება გარკვეული დროის შემდეგ",
  type: "SLASH",
  options: [
    {
      type: "STRING",
      name: "channel-type",
      description: "აირჩიეთ Channel-ის ტიპი",
      choices: [
        {
          name: "Text",
          value: "GUILD_TEXT",
        },
        {
          name: "Voice",
          value: "GUILD_VOICE",
        },
      ],
      required: true,
    },
    {
      name: "channel-name",
      description: "Channel-ის სახელი",
      type: "STRING",
      required: true,
    },
    {
      name: "time",
      description: "რამდენი საათის შემდეგ წაიშლება Channel",
      type: "INTEGER",
      required: true,
      maxValue: 72,
      minValue: 1,
    },
  ],

  async run(interaction, args, client) {
    let channelType = interaction.options.getString("channel-type");
    const channelName = interaction.options.getString("channel-name");
    const time = interaction.options.getInteger("time") * 3600000; //3600000

    let tempChannelData = await tempChannelModel.findOne({
      userID: interaction.user.id,
      channelType: channelType,
    });

    if (tempChannelData) {
      channelExpiry = tempChannelData.expiry;
      channelId = tempChannelData.channelID;
      channelTypeDB = tempChannelData.channelType;
      if (channelExpiry > new Date().getTime()) {
        return interaction.followUp(
          `თქვენ უკვე გაქვთ შექმნილი ჩენელი -> <#${channelId}>, მის წაშლადე დარჩენილი დრო: **${ms(
            channelExpiry - new Date().getTime()
          )}**`
        );
      } else {
        getChannel = client.channels.cache.get(channelId);
        await getChannel.delete();
        tempChannelData.remove({
          userID: interaction.user.id,
          channelType: channelType,
        });
      }
    }

    const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
    embed1 = new Discord.MessageEmbed()
      .setTitle(`Creating Channel Named \`${channelName}\``)
      .setDescription(
        `\`\`\`ჩათში მონიშნეთ ყველა ის პიროვნება ვისი გაწევრიანებაც გსურთ ამ Channel-ში, ან დაწერეთ cancel გასაუქმებლად\`\`\``
      )
      .addFields(
        {
          name: `Channel Type`,
          value: `\`${channelType}\``,
          inline: true,
        },
        {
          name: `Channel Name`,
          value: `\`${channelName}\``,
          inline: true,
        },
        {
          name: `Available For`,
          value: `\`${ms(time)}\``,
          inline: true,
        }
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setColor("PURPLE")
      .setTimestamp();

    interaction.followUp({ embeds: [embed1], files: [Logo] });

    const userChannel = interaction.channel;
    const collector = userChannel.createMessageCollector({
      time: 60000,
      errors: ["time"],
      filter: (m) => m.author.id === interaction.user.id,
    });

    collector.on("collect", async (message) => {
      if (message.content.toLowerCase() === "cancel")
        return (
          interaction.editReply({
            content: `Channel-ის შექმნა გაუქმდა`,
            embeds: [],
          }) && collector.stop()
        );

      userPerms = [
        {
          id: message.guild.roles.everyone,
          deny: ["VIEW_CHANNEL"],
        },
      ];

      if (!message.mentions.members.first()) return;

      message.mentions.members.forEach((mention) => {
        perms = {
          id: mention.id,
          allow: ["VIEW_CHANNEL"],
        };
        userPerms.push(perms);
      });

      collector.stop();

      message.guild.channels
        .create(channelName, {
          type: channelType,
          permissionOverwrites: userPerms,
        })
        .then(async (channel) => {
          if (channelType === "GUILD_TEXT") {
            channel.setParent("951840310663725076", { lockPermissions: false });
          } else {
            channel.setParent("954371750592938014", { lockPermissions: false });
          }

          embed2 = new Discord.MessageEmbed()
            .setTitle(`Channel \`${channelName}\` შეიქმნა`)
            .setDescription("ㅤ")
            .addFields(
              {
                name: `Channel-ის ტიპი ⬇️`,
                value: `\`${channelType}\``,
              },
              {
                name: `Channel-ის სახელი ⬇️`,
                value: `<#${channel.id}>`,
              },
              {
                name: `Channel-ის წაშლამდე დრო ⬇️`,
                value: `\`${ms(time)}\``,
              },
              {
                name: "Channel-ში დამატებული ხალხის სია ⬇️",
                value: message.mentions.members
                  .map((x) => `<@!${x.id}>`)
                  .join("` | `"),
              }
            )
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
              text: `BTU `,
              iconURL: "attachment://BTULogo.png",
            })
            .setColor("PURPLE");

          message.reply({ embeds: [embed2], files: [Logo] });
          channelId = channel.id;
          getChannel = client.channels.cache.get(channelId);
          tempChannelData = await tempChannelModel.create({
            userID: interaction.user.id,
            channelID: channel.id,
            expiry: new Date().getTime() + time,
            channelType: channelType,
          });
          tempChannelData.save();
        })
        .then(
          setTimeout(() => {
            getChannel.delete();
            tempChannelData.remove({
              userID: interaction.user.id,
              channelType: channelType,
            });
          }, time)
        );
    });

    collector.on("end", (msg, reason) => {
      if (reason === "time")
        return interaction.editReply({
          content: `Channel-ის შექმნის დრო გავიდა`,
          embeds: [],
        });
    });
  },
});
