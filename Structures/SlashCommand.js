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
   * @typedef {{name: string, description: string, permissions: Discord.PermissionString, cooldown: Number, ephemeral: Boolean, options: Discord.ApplicationCommandOption[], run: RunFunction }} CommandOptions
   * @param {CommandOptions} Options
   */
  constructor(Options) {
    this.name = Options.name;
    this.description = Options.description;
    this.permissions = Options.permissions;
    this.cooldown = Options.cooldown;
    this.options = Options.options || [];
    this.run = Options.run;
  }
}

module.exports = Command;
