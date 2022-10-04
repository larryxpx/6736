const express = require("express");
const cors = require("cors");
const path = require("path");
const device = require('express-device');
const puppeteer = require('puppeteer')

const PORT = process.env.PORT || 5000;

const app = express();

app.disable('x-powered-by');

// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(device.capture());

app.use("/api/webshot", async (req, res) => {
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

    console.log(req.device.type)

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

    // capture webpage according to device

    if (req.device.type === "phone") {
      // launch headless brpwser
      const browser = await puppeteer.launch(
        {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        }
      );

      // Create a new page
      const page = await browser.newPage();

      // Navigate to some website
      await page.goto(`https://${url}`, {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      });

      await page.setViewport({
        width: 400,
        height: 731,
      });

      await page.screenshot({ path: imageStorage });

      await browser.close();

      return res.sendFile(imageStorage);
    }

    // tablet view screenshot
    if (req.device.type === "tablet") {
      // launch headless brpwser
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      // Create a new page
      const page = await browser.newPage();

      // Navigate to some website
      await page.goto(`https://${url}`, {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      });

      await page.setViewport({
        width: 768,
        height: 1024,
      });

      await page.screenshot({ path: imageStorage });

      await browser.close();

      return res.sendFile(imageStorage);
    }

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

    await page.screenshot({ path: imageStorage });

    await browser.close();
    return res.sendFile(imageStorage);

  } catch (error) {
    console.log(error.message);

    res.status(500).json({erroe: error.message});
  }
});

app.use("/api", (req, res) => {
  res.status(200).json({
    success: true,
    db: true,
  });
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
