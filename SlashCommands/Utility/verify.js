const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const nodemailer = require("nodemailer");
const { PotFriend } = require("../../Data/emojis.json");
const { Profile } = require("../../Database/index");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "btu.bot.0@gmail.com",
    pass: process.env.GPASS,
  },
});

module.exports = new SlashCommand({
  name: "verify",
  description: "გაიარეთ ვერიფიკაცია BTU-ს მეილით",
  cooldown: 3600,
  premium: true,
  options: [
    {
      type: "STRING",
      name: "email",
      description: "ვერიფიკაციის კოდი გამოიგზავნება ამ მეილზე",
      required: true,
    },
  ],

  async run(interaction, args, client) {
    const email = interaction.options.getString("email");
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;

    const logChannel = interaction.guild.channels.cache.find(
      (c) => c.name == "member-logs" && c.isText()
    );
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();

    embed
      .setTitle(`Verification Triggered`)
      .setDescription(
        `User: **<@${interaction.user.id}>**\nEmail: **${email}**\nVerification Code: **${verificationCode}**`
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("PURPLE")
      .setFooter({
        text: `BTU `,
        iconURL: "attachment://BTULogo.png",
      })
      .setTimestamp();

    logChannel.send({ embeds: [embed], files: [Logo] });

    if (!email.endsWith("@btu.edu.ge"))
      return interaction.reply({
        content: "გამოიყენეთ BTU-ს მეილი ! ( @btu.edu.ge ) ",
        ephemeral: true,
      });
    if (
      await profileModel.findOne({
        guildId: interaction.guildid,
        email: email,
      })
    )
      return interaction.reply({
        content: "მეილი უკვე გამოყენებულია !",
        ephemeral: true,
      });

    if (
      await profileModel.findOne({
        guildId: interaction.guildId,
        userID: interaction.user.id,
        email: { $ne: null },
      })
    )
      return interaction.reply({
        content: "თქვენ უკვე გაიარეთ ვერიფიკაცია !",
        ephemeral: true,
      });

    const sentEmail = await transporter.sendMail({
      from: '"No Reply" <btu.bot.0@gmail.com>',
      Date: new Date().getTime(),
      to: email,
      subject: `${verificationCode} Is Your Verification Code For BTU Discord Server`,
      text: `Use This Number To Verify ${verificationCode}`,
    });

    interaction.reply({
      content: `ვერიფიკაციის კოდი გამოიგზავნა მეილზე (შეამოწმე Spam)\nკოდი ჩამიგე პირადში(DM) რომ დაასრულო ვერიფიკაცია !`,
      ephemeral: true,
    });

    const channel = await interaction.user.createDM();

    const collector = channel.createMessageCollector({
      time: 60000,
      errors: ["time"],
      filter: (m) => !m.author.bot,
    });

    collector.on("collect", async (message) => {
      if (message.content == verificationCode) {
        await Profile.findOneAndUpdate(
          { guildId: interaction.guildId, userID: interaction.user.id },
          { $set: { email: email } },
          { upsert: true }
        );

        const memberRole = interaction.guild.roles.cache.find(
          (r) => r.name === "BTU Member"
        );

        if (memberRole) interaction.member.roles.add(memberRole);

        collector.stop();

        message.reply({ content: "ვერიფიკაცია წარმატებით დასრულდა ✅" });

        const welcomeChannel = interaction.guild.channels.cache.find(
          (c) => /welcome/i.test(c.name) && c.isText()
        );
        const rulesChannel = interaction.guild.channels.cache.find(
          (c) => /rules/i.test(c.name) && c.isText()
        )?.id;
        const rolesChannel = interaction.guild.channels.cache.find(
          (c) => /roles/i.test(c.name) && c.isText()
        )?.id;

        const Banner = new Discord.MessageAttachment(
          "./Assets/WelcomeBanner.png"
        );
        const welcomeEmbed = new Discord.MessageEmbed();

        welcomeEmbed
          .setTitle(
            `${PotFriend.emoji} \` Welcome To BTU ${interaction.user.username} ! \` ${PotFriend.emoji}`
          )
          .setDescription(
            `გაეცანი სერვერის წესებს  👉 <#${rulesChannel}>!\nაგრეთვე აირჩიე როლები 👉 <#${rolesChannel}>!`
          )
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("PURPLE")
          .setImage("attachment://WelcomeBanner.png")
          .setFooter({
            text: `BTU `,
            iconURL: "attachment://BTULogo.png",
          })
          .setTimestamp();

        return welcomeChannel?.send({
          embeds: [welcomeEmbed],
          files: [Logo, Banner],
        });
      } else {
        return message.reply({ content: "კოდი არასწორია !" });
      }
    });

    collector.on("end", (msg, reason) => {
      if (reason === "time") {
        return channel.send({
          content: "ვერიფიკაციის კოდის მიღების დრო ამოიწურა !",
        });
      }
    });
    return true;
  },
});
