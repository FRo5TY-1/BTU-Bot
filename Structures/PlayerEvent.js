const Player = require("discord-player");
const Client = require("./Client.js");

/**
 * @template {keyof Player.PlayerEvents} K
 * @param {Client} client
 * @param {Player.PlayerEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}

/**
 * @template {keyof Player.PlayerEvents} K
 */
class PlayerEvent {
  /**
   * @param {K} event
   * @param {RunFunction<K>} runFunction
   */
  constructor(event, runFunction) {
    this.event = event;
    this.run = runFunction;
  }
}

module.exports = PlayerEvent;
