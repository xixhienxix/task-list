const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();

app.use(cors({origin: true}));

app.use(express.json());

const authRouter = require("./routes/auth")(db);
app.use("/", authRouter);

const tasksRouter = require("./routes/tasks")(db);
app.use("/", tasksRouter);


app.get("/health", (req, res) => res.send("API Running!"));

exports.api = functions.https.onRequest(app);
