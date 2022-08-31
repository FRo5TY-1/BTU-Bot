import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect(process.env.MONGODB, {})
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};

import ButtonRole from "./Schemas/buttonRole";
import Cooldown from "./Schemas/cooldown";
import Inventory from "./Schemas/inventory";
import PremiumServer from "./Schemas/premiumServer";
import Profile from "./Schemas/profile";
import ShopItem from "./Schemas/shopItem";
import TempChannel from "./Schemas/tempChannel";
import UpvoteChannel from "./Schemas/upvoteChannel";
import VoiceState from "./Schemas/voiceState";
import WelcomeMessage from "./Schemas/welcomeMessage";

export {
  ButtonRole,
  Cooldown,
  Inventory,
  PremiumServer,
  Profile,
  ShopItem,
  TempChannel,
  UpvoteChannel,
  VoiceState,
  WelcomeMessage,
};
