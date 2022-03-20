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
    const MinecraftRole = "925813134151782401";
    const LOLRole = "923571643891191848";
    const BTUMember = "925255802850258984";
    const OsuRole = "924939736999686154";
    const I_IRole = "940267819180916756";
    const II_IRole = "940267963137814599";
    const III_IRole = "940276732714430484";
    const IV_IRole = "940277151440191488";
    const I_IIRole = "940267586564796417";
    const II_IIRole = "940268000819445820";
    const III_IIRole = "940276728360755310";
    const IV_IIRole = "940277183396605972";

    course_roles_list = [
      "კურსი I სემესტრი I",
      "კურსი I სემესტრი II",
      "კურსი II სემესტრი I",
      "კურსი II სემესტრი II",
      "კურსი III სემესტრი I",
      "კურსი III სემესტრი II",
      "კურსი IV სემესტრი I",
      "კურსი IV სემესტრი II",
    ];

    if (interaction.customId === "AgreeRole") {
      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "თქვენ უკვე ეთანხმებით წესებს",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ დაეთანხმეთ წესებს",
          ephemeral: true,
        });
        Member.roles.add(BTUMember);
      }
    } else if (interaction.customId === "lolrole") {
      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        if (Member.roles.cache.some((role) => role.name === "LOL")) {
          interaction.followUp({
            content: "თქვენ ჩამოგერთვათ LOL როლი",
            ephemeral: true,
          });
          Member.roles.remove(LOLRole);
        } else {
          interaction.followUp({
            content: "თქვენ მოგენიჭათ LOL როლი",
            ephemeral: true,
          });
          Member.roles.add(LOLRole);
        }
      } else {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      }
    } else if (interaction.customId === "minecraftrole") {
      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        if (Member.roles.cache.some((role) => role.name === "Minecraft")) {
          interaction.followUp({
            content: "თქვენ ჩამოგერთვათ Minecraft როლი",
            ephemeral: true,
          });
          Member.roles.remove(MinecraftRole);
        } else {
          interaction.followUp({
            content: "თქვენ მოგენიჭათ Minecraft როლი",
            ephemeral: true,
          });
          Member.roles.add(MinecraftRole);
        }
      } else {
        message.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      }
    } else if (interaction.customId === "osurole") {
      if (Member.roles.cache.some((role) => role.name === "BTU Member")) {
        if (Member.roles.cache.some((role) => role.name === "Osu!")) {
          interaction.followUp({
            content: "თქვენ ჩამოგერთვათ Osu! როლი",
            ephemeral: true,
          });
          Member.roles.remove(OsuRole);
        } else {
          interaction.followUp({
            content: "თქვენ მოგენიჭათ Osu! როლი",
            ephemeral: true,
          });
          Member.roles.add(OsuRole);
        }
      } else {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      }
    } else if (interaction.customId === "I-I") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი I სემესტრი I როლი",
          ephemeral: true,
        });
        Member.roles.add(I_IRole);
      }
    } else if (interaction.customId === "I-II") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი I სემესტრი II როლი",
          ephemeral: true,
        });
        Member.roles.add(I_IIRole);
      }
    } else if (interaction.customId === "II-I") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი II სემესტრი I როლი",
          ephemeral: true,
        });
        Member.roles.add(II_IRole);
      }
    } else if (interaction.customId === "II-II") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი II სემესტრი II როლი",
          ephemeral: true,
        });
        Member.roles.add(II_IIRole);
      }
    } else if (interaction.customId === "III-I") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი III სემესტრი I როლი",
          ephemeral: true,
        });
        Member.roles.add(III_IRole);
      }
    } else if (interaction.customId === "III-II") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი III სემესტრი II როლი",
          ephemeral: true,
        });
        Member.roles.add(III_IIRole);
      }
    } else if (interaction.customId === "IV-I") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი IV სემესტრი I როლი",
          ephemeral: true,
        });
        Member.roles.add(IV_IRole);
      }
    } else if (interaction.customId === "IV-II") {
      if (!Member.roles.cache.some((role) => role.name === "BTU Member")) {
        interaction.followUp({
          content: "როლის მისაღებად უნდა დაეთანხმოთ წესებს",
          ephemeral: true,
        });
      } else if (
        Member.roles.cache.some((role) => course_roles_list.includes(role.name))
      ) {
        interaction.followUp({
          content: "თქვენ უკვე აიჩიეთ კურსი",
          ephemeral: true,
        });
      } else {
        interaction.followUp({
          content: "თქვენ მოგენიჭათ კურსი IV სემესტრი II როლი",
          ephemeral: true,
        });
        Member.roles.add(IV_IIRole);
      }
    }
  }
});
