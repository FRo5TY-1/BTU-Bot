const SlashCommand = require("../../Structures/SlashCommand.js");
const tempChannelModel = require("../../DBModels/tempChannelsSchema.js");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = new SlashCommand({
  name: "tempchannel",
  description: "Temporary Channel Commands",
  premium: true,
  options: [
    {
      type: "SUB_COMMAND",
      name: "create",
      description: "Create A Temporary Channel",
      options: [
        {
          type: "STRING",
          name: "channel-type",
          description: "Channel Type",
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
          description: "Channel Name",
          type: "STRING",
          required: true,
        },
        {
          name: "time",
          description: "Time In Hours, After Which The Channel WIll Be Deleted",
          type: "INTEGER",
          required: true,
          maxValue: 168,
          minValue: 1,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "Add Users To Temporary Channel",
      options: [
        {
          type: "STRING",
          name: "channel-type",
          description: "Channel Type",
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
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "Remove Users From Temporary Channel",
      options: [
        {
          type: "STRING",
          name: "channel-type",
          description: "Channel Type",
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
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "delete",
      description: "Delete Temporary Channel",
      options: [
        {
          type: "STRING",
          name: "channel-type",
          description: "Channel Type",
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
      ],
    },
  ],

  async run(interaction, args, client) {
    const channelType = interaction.options.getString("channel-type");
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const subCommand = interaction.options.getSubcommand();
    let tempChannelData = await tempChannelModel.findOne({
      guildId: interaction.guild.id,
      userID: interaction.user.id,
      channelType: channelType,
    });
    async function deleteChannel(DB) {
      const getChannel = interaction.guild.channels.cache.get(DB.channelID);
      await getChannel?.delete();
      DB?.remove({
        userID: interaction.user.id,
        channelType: DB.channelType,
      });
    }
    const userPerms = [
      {
        id: interaction.guild.roles.everyone,
        deny: ["VIEW_CHANNEL"],
      },
      {
        id: interaction.user.id,
        allow: ["VIEW_CHANNEL"],
      },
    ];

    if (!tempChannelData && subCommand != "create")
      return interaction.reply({
        content: "You Don't Have A Temporary Channel Created",
      });

    //create subcommand starts here

    if (subCommand === "create") {
      const channelName = interaction.options.getString("channel-name");
      const time = interaction.options.getInteger("time") * 3600000; //3600000
      const textCategory = interaction.guild.channels.cache.find(
        (c) => c.name.toUpperCase() == "TEMPORARY TEXT CHANNELS"
      );
      const voiceCategory = interaction.guild.channels.cache.find(
        (c) => c.name.toUpperCase() == "TEMPORARY VOICE CHANNELS"
      );

      const category =
        channelType === "GUILD_TEXT" ? textCategory : voiceCategory;

      if (tempChannelData) {
        const channelExpiry = tempChannelData.expiry;
        const channelID = tempChannelData.channelID;
        if (channelExpiry > new Date().getTime()) {
          return interaction.reply(
            `You Already Have An Active Temporary Channel -> <#${channelID}>\nWhich Will Be deleted -> **<t:${Math.floor(
              channelExpiry / 1000
            )}:R>**`
          );
        } else {
          deleteChannel(tempChannelData);
        }
      }
      const embed = new Discord.MessageEmbed();

      await interaction.guild.channels
        .create(channelName, {
          type: channelType,
          permissionOverwrites: userPerms,
        })
        .then(async (channel) => {
          channel.setParent(category?.id, { lockPermissions: false });

          embed
            .setTitle(`Temporary Channel Created Successfully`)
            .setDescription(
              `\`\`\`Use /tempchannel add To Add People To This Channel \`\`\``
            )
            .addFields(
              {
                name: `Channel Type ⬇️`,
                value: `**\`\`\`${channelType}\`\`\`**`,
                inline: true,
              },
              {
                name: `Channel Name ⬇️`,
                value: `**\`\`\`${channelName}\`\`\`**`,
                inline: true,
              },
              {
                name: `Will Be Deleted In ⬇️`,
                value: `**\`\`\`${ms(time)}\`\`\`**`,
                inline: true,
              }
            )
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
              text: `Created By ${interaction.user.username}`,
              iconURL: "attachment://BTULogo.png",
            })
            .setColor("PURPLE")
            .setTimestamp();

          interaction.reply({ embeds: [embed], files: [Logo] });
          tempChannelData = await tempChannelModel.create({
            guildId: interaction.guild.id,
            userID: interaction.user.id,
            channelID: channel.id,
            expiry: new Date().getTime() + time,
            channelType: channelType,
          });
          tempChannelData.save();
        })
        .then(
          setTimeout(() => {
            deleteChannel(tempChannelData);
          }, time)
        );
    }

    // delete subbcommand starts here
    else if (interaction.options.getSubcommand() === "delete") {
      const channelName = interaction.guild.channels.cache.get(
        tempChannelData.channelID
      ).name;

      deleteChannel(tempChannelData);
      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`Temporary Channel Deleted`)
        .addFields(
          {
            name: `Channel Type ⬇️`,
            value: `\`${channelType}\``,
            inline: true,
          },
          {
            name: `Channel Name ⬇️`,
            value: `\`${channelName}\``,
            inline: true,
          }
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: `Created By ${interaction.user.username}`,
          iconURL: "attachment://BTULogo.png",
        })
        .setColor("PURPLE")
        .setTimestamp();

      return interaction.reply({ embeds: [embed], files: [Logo] });
    }

    // add subcommand starts here
    else if (interaction.options.getSubcommand() === "add") {
      const channel = interaction.guild.channels.cache.get(
        tempChannelData.channelID
      );
      const expiry = tempChannelData.expiry - new Date().getTime();

      const embed = new Discord.MessageEmbed()
        .setTitle("Adding Members To Channel")
        .setDescription(
          `**\`\`\`You Have 30 Seconds To Tag Each Person You Wish To Add With @ And Send The Message\`\`\`**`
        )
        .addFields(
          {
            name: `Channel Type ⬇️`,
            value: `**\`\`\`${channelType}\`\`\`**`,
            inline: true,
          },
          {
            name: `Channel Name ⬇️`,
            value: `**\`\`\`${channel.name}\`\`\`**`,
            inline: true,
          },
          {
            name: `Will Be Deleted In ⬇️`,
            value: `**\`\`\`${ms(expiry)}\`\`\`**`,
            inline: true,
          }
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: `Created by ${interaction.user.username}`,
          iconURL: "attachment://BTULogo.png",
        })
        .setColor("PURPLE");

      interaction.reply({ embeds: [embed], files: [Logo] });

      const collector = interaction.channel.createMessageCollector({
        time: 30000,
        errors: ["time"],
        filter: (m) => m.author.id === interaction.user.id,
      });

      collector.on("collect", async (message) => {
        if (!message.mentions.members.first()) return;

        collector.stop();

        const mentions = message.mentions.members.first(5);

        mentions.forEach((user) => {
          channel.permissionOverwrites.edit(user.id, { VIEW_CHANNEL: true });
        });
        setTimeout(() => {
          const successEmbed = new Discord.MessageEmbed()
            .setTitle(`Added Members To Channel`)
            .addFields(
              {
                name: `Channel Type ⬇️`,
                value: `**\`\`\`${channelType}\`\`\`**`,
                inline: true,
              },
              {
                name: `Channel Name ⬇️`,
                value: `**\`\`\`${channel.name}\`\`\`**`,
                inline: true,
              },
              {
                name: `Will Be Deleted In ⬇️`,
                value: `**\`\`\`${ms(expiry)}\`\`\`**`,
                inline: true,
              },
              {
                name: "List OF People In Channel ⬇️",
                value: channel.members
                  .filter((m) => !m.permissions.has("ADMINISTRATOR"))
                  .map((m) => `<@!${m.id}>`)
                  .join("` | `"),
              }
            )
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
              text: `Created by ${interaction.user.username}`,
              iconURL: "attachment://BTULogo.png",
            })
            .setColor("PURPLE");

          message?.reply({ embeds: [successEmbed], files: [Logo] });
        }, 1500);
      });

      collector.on("end", (msg, reason) => {
        if (reason === "time")
          return interaction?.editReply({
            content: `Time's Up`,
            embeds: [],
            files: [],
          });
      });
    }

    // remove subcommand starts here
    else if (interaction.options.getSubcommand() === "remove") {
      const channel = client.channels.cache.get(tempChannelData.channelID);

      const embed = new Discord.MessageEmbed()
        .setTitle("Removing Members From Channel")
        .setDescription(
          `**\`\`\`You Have 30 Seconds To Tag Each Person You Wish To Remove With @ And Send The Message\`\`\`**`
        )
        .addFields(
          {
            name: `Channel Type ⬇️`,
            value: `**\`\`\`${channelType}\`\`\`**`,
            inline: true,
          },
          {
            name: `Channel Name ⬇️`,
            value: `**\`\`\`${channel.name}\`\`\`**`,
            inline: true,
          },
          {
            name: `Will Be Deleted In ⬇️`,
            value: `**\`\`\`${ms(
              tempChannelData.expiry - new Date().getTime()
            )}\`\`\`**`,
            inline: true,
          }
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: `Created by ${interaction.user.username}`,
          iconURL: "attachment://BTULogo.png",
        })
        .setColor("PURPLE");

      interaction.reply({ embeds: [embed], files: [Logo] });

      const collector = interaction.channel.createMessageCollector({
        time: 30000,
        errors: ["time"],
        filter: (m) => m.author.id === interaction.user.id,
      });

      collector.on("collect", async (message) => {
        if (!message.mentions.members.first()) return;

        collector.stop();

        const mentions = message.mentions.members.first(5);

        mentions
          .filter((user) => user.id != interaction.user.id)
          .forEach((user) => {
            channel.permissionOverwrites.edit(user.id, { VIEW_CHANNEL: false });
          });

        setTimeout(() => {
          const successEmbed = new Discord.MessageEmbed()
            .setTitle(`Removed Members From Channel`)
            .addFields(
              {
                name: `Channel Type ⬇️`,
                value: `**\`\`\`${channelType}\`\`\`**`,
                inline: true,
              },
              {
                name: `Channel Name ⬇️`,
                value: `**\`\`\`${channel.name}\`\`\`**`,
                inline: true,
              },
              {
                name: `Will Be Deleted In ⬇️`,
                value: `**\`\`\`${ms(
                  tempChannelData.expiry - new Date().getTime()
                )}\`\`\`**`,
                inline: true,
              },
              {
                name: "List OF People In Channel ⬇️",
                value: channel.members
                  .filter((m) => !m.permissions.has("ADMINISTRATOR"))
                  .map((m) => `<@!${m.id}>`)
                  .join("` | `"),
              }
            )
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
              text: `Created by ${interaction.user.username}}`,
              iconURL: "attachment://BTULogo.png",
            })
            .setColor("PURPLE");

          message?.reply({ embeds: [successEmbed], files: [Logo] });
        }, 1500);
      });

      collector.on("end", (msg, reason) => {
        if (reason === "time")
          return interaction?.editReply({
            content: `Time's Up`,
            embeds: [],
            files: [],
          });
      });
    }
  },
});
