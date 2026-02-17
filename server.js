const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get("/fetch", async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("No URL provided");
  }

  try {
    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);

  } catch (err) {
    res.status(500).send("Error fetching file");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
