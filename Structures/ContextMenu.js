const Client = require("./Client.js");
const Discord = require("discord.js");

/**
 * @param {Discord.CommandInteraction} interaction
 * @param {Client} client
 */
function RunFunction(interaction, client) {}

class ContextMenu {
  /**
   * @typedef {{name: string, type: String, run: RunFunction }} CommandOptions
   * @param {CommandOptions} Options
   */
  constructor(Options) {
    this.name = Options.name;
    this.type = ["USER", "MESSAGE"].includes(Options.type)
      ? Options.type
      : "USER";
    this.run = Options.run;
  }
}

module.exports = ContextMenu;
