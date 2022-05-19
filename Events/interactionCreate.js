const Event = require("../Structures/Event.js");
const messageCreate = require("./messageCreate.js");
const rolesModel = require("../DBModels/buttonRolesSchema.js");
const Discord = require("discord.js");

module.exports = new Event(
  "interactionCreate",
  /**
   * @param {Discord.Interaction} interaction
   */ async (client, interaction) => {
    if (!interaction.guild)
      return interaction.reply({ content: "Don't DM Me!", ephemeral: true });
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
        return interaction.reply({
          content: "error",
          ephemeral: true,
        });
      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );
      if (
        !interaction.member
          .permissionsIn(interaction.channel.id)
          .has(cmd.permissions || [])
      )
        return interaction.reply({
          content: `You Don't Have Permission To Use This Command`,
          ephemeral: false,
        });
      cmd.run(interaction, args, client);
    }

    if (interaction.isButton()) {
      if (interaction.message.partial) await interaction.message.fetch();
      const message = interaction.message;

      const Member = interaction.member;
      const memberRole = interaction.guild.roles.cache.find(
        (r) => r.name === "BTU Member"
      );
      const roleDeviderRole = interaction.guild.roles.cache.find(
        (r) => r.name === "ㅤ⊱─── { Gaming Roles } ───⊰ㅤㅤ"
      );

      const nonchangable_roles = await rolesModel
        .find({
          guildID: interaction.guild.id,
          messageID: message.id,
          changable: false,
        })
        .exec();
      const changable_roles = await rolesModel
        .find({
          guildID: interaction.guild.id,
          messageID: message.id,
          changable: true,
        })
        .exec();

      const BIDList = nonchangable_roles
        .map((v) => v.buttonCustomID)
        .concat(
          changable_roles.map((v) => v.buttonCustomID),
          ["rulesagree"]
        );
      if (!BIDList.includes(interaction.customId)) return;

      await interaction.deferUpdate();

      if (interaction.customId === "rulesagree") {
        if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
          return interaction.followUp({
            content: "**```You Already Agreed To Server Rules```**",
            ephemeral: true,
          });
        } else {
          interaction.followUp({
            content: "**```You Agreed To Server Rules```**",
            ephemeral: true,
          });
          return Member.roles.add(memberRole);
        }
      }

      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        const nonchangable_IDs = nonchangable_roles.map((v) => v.roleID);
        for (i = 0; i < nonchangable_roles.length; i++) {
          const button = nonchangable_roles[i];
          const role = interaction.guild.roles.cache.get(button.roleID);
          if (interaction.customId === button.buttonCustomID) {
            if (
              Member.roles.cache.some((r) => nonchangable_IDs.includes(r.id))
            ) {
              interaction.followUp({
                content: `**\`\`\`You Already Have This Type Of Role!\nThis Role Can't Be Changed\nContact A Mod If You Chose Wrong Role!\`\`\`**`,
                ephemeral: true,
              });
              break;
            } else {
              interaction.followUp({
                content: `**\`\`\`${role.name} Role Was Successfully Added!\`\`\`**`,
                ephemeral: true,
              });
              Member.roles.add(role.id);
              break;
            }
          }
        }
        for (i = 0; i < changable_roles.length; i++) {
          const button = changable_roles[i];
          if (interaction.customId === button.buttonCustomID) {
            const role = interaction.guild.roles.cache.get(button.roleID);
            if (Member.roles.cache.some((r) => role.id === r.id)) {
              interaction.followUp({
                content: `**\`\`\`${role.name} Role Was Successfully Removed!\`\`\`**`,
                ephemeral: true,
              });
              Member.roles.remove(role.id);
              break;
            } else {
              interaction.followUp({
                content: `**\`\`\`${role.name} Role Was Successfully Added!\`\`\`**`,
                ephemeral: true,
              });
              Member.roles.add([button.roleID, roleDeviderRole.id]);
              break;
            }
          }
        }
      } else {
        return interaction.followUp({
          content: "**```You Must Agree To Server Rules To Get This Role```**",
          ephemeral: true,
        });
      }
    }
  }
);
