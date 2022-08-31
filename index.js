console.clear();

require("dotenv").config();

import "./Structures/Client.js";

import { connect } from "./Database/index";
connect();

import "./api/server.ts";
