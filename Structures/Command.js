const Client = require("./Client.js");
const Discord = require("discord.js");

/**
 * @param {Discord.CommandInteraction} interaction
 * @param {string[]} args
 * @param {Client} client
 */
function RunFunction(interaction, args, client) {}

class Command {
  /**
   * @typedef {{name: string, description: string, showHelp: Boolean, aliases: string, permissions: Discord.PermissionString, ephemeral: Boolean, type: String, options: Discord.ApplicationCommandOption[], run: RunFunction }} CommandOptions
   * @param {CommandOptions} Options
   */
  constructor(Options) {
    this.name = Options.name;
    this.showHelp = Options.showHelp;
    this.description = Options.description;
    this.permissions = Options.permissions;
    this.aliases = Options.aliases;
    this.type = ["USER", "SLASH", "TEXT"].includes(Options.type)
      ? Options.type
      : "SLASH";
    this.ephemeral = Options.ephemeral;
    this.options = Options.options || [];
    this.run = Options.run;
  }
}

module.exports = Command;
