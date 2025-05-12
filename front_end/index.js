import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";

const APP = express();
const port = 3001;

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

APP.use(express.static(path.join(__dirName, "public")));
APP.use(bodyParser.urlencoded({ extended: true }));
APP.set("view engine", "ejs");
APP.set("views", path.join(__dirName, "views"));

APP.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://afghan-proverbs-api-3.onrender.com/proverbs/"
    );
    const proverbs = response.data;
    res.render("homePage", { proverbs });
  } catch (error) {
    res.status(500).send("error getting proverbs");
  }
});
APP.get("/proverbs/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://afghan-proverbs-api-3.onrender.com/proverbs/${req.params.id}`
    );
    const proverb = response.data;
    res.render("detail", { proverb });
  } catch (error) {
    res.status(404).send("Proverb not found");
  }
});

APP.get("/proverbs/:id/delete", async (req, res) => {
  try {
    await axios.delete(
      `https://afghan-proverbs-api-3.onrender.com/proverbs/${req.params.id}`
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("failed to delete");
  }
});

APP.listen(port, () => {
  console.log("server is running on port", port);
});
