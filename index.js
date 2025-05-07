import express from "express";

import proverbRoutes from "./routes/proverbs.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/proverbs", proverbRoutes);
app.get("/", (req, res) => {
  res.send("welcome");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
