import { Router } from "express";
import fs from "fs/promises";

const router = Router();
const filePath = "./data/proverbs.json";

router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const proverbs = JSON.parse(data);
    res.json(proverbs);
  } catch (err) {
    res.status(500).json({ message: "err reading data" });
  }
});
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

export default router;
