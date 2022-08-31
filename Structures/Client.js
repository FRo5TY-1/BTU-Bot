const { Client, Intents, Collection } = require("discord.js");
const SlashCommand = require("./SlashCommand.js");
const Event = require("./Event.js");
const fs = require("fs");
const PlayerEvent = require("./PlayerEvent.js");
const { Player } = require("discord-player");
const ContextMenu = require("./ContextMenu.js");

class ExtendedClient extends Client {
  /**
   * @param {string} token Bot Token
   */
  constructor(token) {
    super({
      intents: new Intents(32767),
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
    });

    this.token = token;

    /**
     * @type {Collection<string, SlashCommand>}
     */
    this.slashCommands = new Collection();

    /**
     * @type {Collection<string, ContextMenu>}
     */
    this.contextMenus = new Collection();

    /**
     * @type {Collection<string, Discord.Collector>}
     */
    this.collectors = new Collection();

    /**
     * @type {Collection<string, NodeJS.Timeout>}
     */
    this.musicTimeouts = new Collection();

    /**
     * @type {Player}
     */
    this.player = new Player(this, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });

    this.start();
  }

  start() {
    fs.readdirSync("./SlashCommands").forEach((dir) => {
      const slashCommands = fs
        .readdirSync(`./SlashCommands/${dir}/`)
        .filter((file) => file.endsWith(".js"));
      for (let file of slashCommands) {
        /**
         * @type {SlashCommand}
         */
        const slashCommand = require(`../SlashCommands/${dir}/${file}`);
        if (slashCommand.permissions) slashCommand.defaultPermission = false;
        this.slashCommands.set(slashCommand.name, slashCommand);
      }
    });

    console.log(`${this.slashCommands.size} Slash Commands Loaded !`);

    fs.readdirSync("./ContextMenus")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {ContextMenu}
         */
        const contextMenu = require(`../ContextMenus/${file}`);
        this.contextMenus.set(contextMenu.name, contextMenu);
      });

    console.log(`${this.contextMenus.size} Context Menus Loaded !`);

    fs.readdirSync("./Events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {Event}
         */
        const event = require(`../Events/${file}`);
        this.on(event.event, event.run.bind(null, this));
      });

    fs.readdirSync("./PlayerEvents")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {PlayerEvent}
         */
        const event = require(`../PlayerEvents/${file}`);
        this.player.on(event.event, event.run.bind(null, this));
      });

    this.login(this.token);
  }
}

const client = new ExtendedClient(process.env.CLIENT_TOKEN);

module.exports = client;
