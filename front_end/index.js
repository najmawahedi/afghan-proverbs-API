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

APP.get("/random", async (req, res) => {
  try {
    const response = await axios.get(
      "https://afghan-proverbs-api-12.onrender.com/proverbs/random"
    );
    const randomProverb = response.data;
    res.render("random", { proverb: randomProverb });
  } catch (error) {
    console.error("Error fetching random proverb:", error.message);
    res.status(500).send("Error fetching random proverb");
  }
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
APP.get("/proverbs", async (req, res) => {
  const category = req.query.category;
  try {
    const url = category
      ? `https://afghan-proverbs-api-12.onrender.com/proverbs?category=${encodeURIComponent(
          category
        )}`
      : "https://afghan-proverbs-api-12.onrender.com/proverbs/";
    const response = await axios.get(url);
    const proverbs = response.data;
    if (category) {
      res.render("categoryPage", { proverbs, category });
    } else {
      res.render("homePage", { proverbs });
    }
  } catch (error) {
    res.status(500).send("error getting proverbs");
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

APP.get("/proverbs/categoryList", async (req, res) => {
  try {
    const response = await axios.get(
      "https://afghan-proverbs-api-12.onrender.com/proverbs"
    );
    const proverbs = response.data;

    const categories = [...new Set(proverbs.map((p) => p.category))];
    res.render("categoryList", { categories });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to load categories.");
  }
});

// Route to show proverbs by category
APP.get("/proverbs", async (req, res) => {
  const category = req.query.category;
  try {
    let response;

    if (category) {
      const encodedCategory = encodeURIComponent(category);
      response = await axios.get(
        `https://afghan-proverbs-api-12.onrender.com/proverbs?category=${encodedCategory}`
      );
    } else {
      response = await axios.get(
        "https://afghan-proverbs-api-12.onrender.com/proverbs"
      );
    }

    const proverbs = response.data;

    if (!proverbs || proverbs.length === 0) {
      return res.status(404).send("No proverbs found for this category.");
    }

    res.render("proverbs", { proverbs, category });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to fetch proverbs.");
  }
});

APP.listen(port, () => {
  console.log("server is running on port", port);
});
