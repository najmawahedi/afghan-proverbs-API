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
export default router;
