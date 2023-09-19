import path from "node:path";
import url from "node:url";

import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import Redis from "ioredis";
import cors from "cors";

import config from "./util/config.js";
import indexRouter from "./controller/index.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const router = express.Router();
const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  db: 0,
});
const redisStore = new RedisStore({
  client: redis,
  prefix: 'sess:'
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(session({
  cookie: {
    maxAge: 365 * 86400e3, // 365 days
  },
  resave: false, // required: force lightweight session keep alive (touch)
  saveUninitialized: true,
  secret: config.sessionSecret,
  store: redisStore,
}))
app.set('views', path.resolve(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(new indexRouter({router, redis}));
app.use(router);
app.listen(config.port, config.host, () => {
  console.log(`Server is running on port ${config.port}`);
});

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
process.on('uncaughtExceptionMonitor', console.error);
process.on('multipleResolves', console.error);
