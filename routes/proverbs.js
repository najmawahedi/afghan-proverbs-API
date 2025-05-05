import { response, Router } from "express";
import fs from "fs/promises";

const router = Router();
const filePath = "./data/proverbs.json";

// GET all proverbs
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const proverbs = JSON.parse(data);
    res.json(proverbs);
  } catch (err) {
    res.status(500).json({ message: "Error reading data" });
  }
});

// GET proverb by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const proverbs = JSON.parse(data);
    const id = parseInt(req.params.id);
    const proverb = proverbs.find((p) => p.id === id);

    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }

    res.json(proverb);
  } catch (err) {
    res.status(500).json({ message: "Error reading data" });
  }
});

// POST new proverb
router.post("/", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const proverbs = JSON.parse(data);
    const { textDari, textPashto, translationEn, meaning, category } = req.body;

    if (!textDari || !textPashto || !translationEn || !meaning || !category) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const newProverb = {
      id: proverbs.length > 0 ? proverbs[proverbs.length - 1].id + 1 : 1,
      textDari,
      textPashto,
      translationEn,
      meaning,
      category,
    };

    proverbs.push(newProverb);
    await fs.writeFile(filePath, JSON.stringify(proverbs, null, 2), "utf-8");

    res
      .status(201)
      .json({ message: "Proverb added successfully", proverb: newProverb });
  } catch (err) {
    res.status(500).json({ message: "Error saving data" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const proverbs = JSON.parse(data);
    const id = parseInt(req.params.id);

    const index = proverbs.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Proverb not found" });
    }

    const updatedProverb = {
      ...proverbs[index],
      ...req.body,
    };

    proverbs[index] = updatedProverb;

    await fs.writeFile(filePath, JSON.stringify(proverbs, null, 2), "utf8");
    res.json(updatedProverb);
  } catch (err) {
    res.status(500).json({ message: "Error updating proverb" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const id = parseInt(req.params.id);
    let proverbs = JSON.parse(data);
    const index = proverbs.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "proverb not found" });
    }
    const deletedProverb = proverbs.splice(index, 1)[0];
    await fs.writeFile(filePath, JSON.stringify(proverbs, null, 2), "utf-8");
    res.json({
      message: `proverb deleted seccussfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "error deleting proverb" });
  }
});

export default router;
