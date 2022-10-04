const express = require("express");
const cors = require("cors");
const path = require("path");
const puppeteer = require('puppeteer')

const PORT = process.env.PORT || 5000;

const app = express();

app.disable('x-powered-by');

// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/", async (req, res) => {
  const generateID = () => {
    const ID = new Date().getTime().toString(36);
    return ID;
  };

  try {
    if (!req.query.url) {
      return res.json({
        error: "URL is required",
      });
    }

    // get token from parameter
    const token = req.query.token;

    // get url parameter
    const url = req.query.url;

    // set screenshot ID & save path
    const ID = generateID();

    const imageStorage = path.join(
      __dirname,
      "./public/" + ID + ".png"
    );

    // launch headless brpwser
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox'
      ],
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to some website
    await page.goto(`https://${url}`, {
      waitUntil: "load",
      // Remove the timeoutt
      timeout: 0,
    });

    await page.setViewport({
      width: 768,
      height: 1024,
    });

    await page.screenshot({ path: imageStorage });

    await browser.close();
    return res.sendFile(imageStorage);

  } catch (error) {
    console.log(error.message);

    res.status(500).json({ erroe: error.message });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
