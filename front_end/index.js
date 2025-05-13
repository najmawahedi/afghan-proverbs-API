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
      "https://afghan-proverbs-api-12.onrender.com/proverbs/"
    );
    const proverbs = response.data;
    res.render("homePage", { proverbs });
  } catch (error) {
    res.status(500).send("error getting proverbs");
  }
});

APP.get("/proverbs/new", (req, res) => {
  res.render("add"); // 'add.ejs' file
});
APP.get("/proverbs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      `https://afghan-proverbs-api-12.onrender.com/proverbs/${id}`
    );
    const proverb = response.data;
    res.render("detail", { proverb });
  } catch (error) {
    res.status(404).send("Proverb not found");
  }
});

APP.post("/proverbs/:id/delete", async (req, res) => {
  try {
    const id = req.params.id;
    await axios.delete(
      `https://afghan-proverbs-api-12.onrender.com/proverbs/${id}`
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete");
  }
});

APP.get("/proverbs/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      `https://afghan-proverbs-api-12.onrender.com/proverbs/${id}`
    );
    const proverb = response.data;
    res.render("edit", { proverb });
  } catch (error) {
    res.status(404).send("proverb not found");
  }
});
APP.post("/proverbs/:id/edit", async (req, res) => {
  const id = req.params.id;
  const updatedProverb = {
    textDari: req.body.textDari,
    textPashto: req.body.textPashto,
    translationEn: req.body.translationEn,
    meaning: req.body.meaning,
    category: req.body.category,
  };

  try {
    await axios.put(
      `https://afghan-proverbs-api-12.onrender.com/proverbs/${id}`,
      updatedProverb
    );
    res.redirect(`/proverbs/${id}`);
  } catch (error) {
    res.status(500).send("Failed to update proverb");
  }
});

// Show the add form

// Handle form submission
APP.post("/proverbs", async (req, res) => {
  const newProverb = {
    textDari: req.body.textDari,
    textPashto: req.body.textPashto,
    translationEn: req.body.translationEn,
    meaning: req.body.meaning,
    category: req.body.category,
  };

  try {
    await axios.post(
      "https://afghan-proverbs-api-12.onrender.com/proverbs",
      newProverb
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to add proverb");
  }
});

APP.listen(port, () => {
  console.log("server is running on port", port);
});
