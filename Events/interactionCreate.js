const Event = require("../Structures/Event.js");
const messageCreate = require("./messageCreate.js");

module.exports = new Event("interactionCreate", async (client, interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.followUp({
        content: "error",
        ephemeral: true,
      });
    await interaction
      .deferReply({ ephemeral: cmd.ephemeral ? cmd.ephemeral : false })
      .catch(() => {});
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
    if (!interaction.member.permissions.has(cmd.permissions || []))
      return interaction.followUp({
        content: `არ გაქვთ ამ ბრძანების გამოყენების უფლება`,
        ephemeral: false,
      });
    cmd.run(interaction, args, client);
  }

  if (interaction.isContextMenu()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(interaction, args, client);
  }

  if (interaction.isButton()) {
    await interaction.deferUpdate();

    if (interaction.message.partial) await interaction.message.fetch();
    const message = interaction.message;

    const Member = interaction.member;
    const BTUMemberRole = "925255802850258984";

    const nonchangable_roles = [
      {
        customID: "I-I",
        name: "კურსი I სემესტრი I",
        roleID: "940267819180916756",
      },
      {
        customID: "I-II",
        name: "კურსი I სემესტრი II",
        roleID: "940267586564796417",
      },
      {
        customID: "II-I",
        name: "კურსი II სემესტრი I",
        roleID: "940267963137814599",
      },
      {
        customID: "II-II",
        name: "კურსი II სემესტრი II",
        roleID: "940268000819445820",
      },
      {
        customID: "III-I",
        name: "კურსი III სემესტრი I",
        roleID: "940276732714430484",
      },
      {
        customID: "III-II",
        name: "კურსი III სემესტრი II",
        roleID: "940276728360755310",
      },
      {
        customID: "IV-I",
        name: "კურსი IV სემესტრი I",
        roleID: "940277151440191488",
      },
      {
        customID: "IV-II",
        name: "კურსი IV სემესტრი II",
        roleID: "940277183396605972",
      },
    ];

    const changable_roles = [
      {
        customID: "lolrole",
        name: "LOL",
        roleID: "923571643891191848",
      },
      {
        customID: "minecraftrole",
        name: "Minecraft",
        roleID: "925813134151782401",
      },
      {
        customID: "osurole",
        name: "Osu",
        roleID: "924939736999686154",
      },
    ];

    const BIDList =
      nonchangable_roles.map((value) => value.customID) +
      changable_roles.map((value) => value.customID) +
      ["rulesagree"];
    if (!BIDList.includes(interaction.customId)) return;

    if (interaction.customId === "rulesagree") {
      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        return interaction.followUp({
          content: "თქვენ უკვე ეთანხმებით წესებს",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ დაეთანხმეთ წესებს",
          ephemeral: true,
        });
        return Member.roles.add(BTUMemberRole);
      }
    }

    if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
      const nonchangable_names = nonchangable_roles.map((value) => value.name);
      for (i = 0; i < nonchangable_roles.length; i++) {
        if (interaction.customId === nonchangable_roles[i].customID) {
          if (
            Member.roles.cache.some((role) =>
              nonchangable_names.includes(role.name)
            )
          ) {
            interaction.followUp({
              content: `თქვენ უკვე გაქვთ ${nonchangable_roles[i].name} როლი!\n ამ როლის შეცვლა არ შეიძლება\n თუ როლის არჩევა შეგეშალათ დაუკავშრდით Mod-ს`,
              ephemeral: true,
            });
            break;
          } else {
            interaction.followUp({
              content: `თქვენ მოგენიჭათ ${nonchangable_roles[i].name} როლი`,
              ephemeral: true,
            });
            Member.roles.add(nonchangable_roles[i].roleID);
            break;
          }
        }
      }
      for (i = 0; i < changable_roles.length; i++) {
        if (interaction.customId === changable_roles[i].customID) {
          if (
            Member.roles.cache.some(
              (role) => changable_roles[i].name === role.name
            )
          ) {
            interaction.followUp({
              content: `თქვენ ჩამოგერთვათ ${changable_roles[i].name} როლი`,
              ephemeral: true,
            });
            Member.roles.remove(changable_roles[i].roleID);
            break;
          } else {
            interaction.followUp({
              content: `თქვენ მოგენიჭათ ${changable_roles[i].name} როლი`,
              ephemeral: true,
            });
            Member.roles.add(changable_roles[i].roleID);
            break;
          }
        }
      }
    } else {
      return interaction.followUp({
        content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
        ephemeral: true,
      });
    }
  }
});
