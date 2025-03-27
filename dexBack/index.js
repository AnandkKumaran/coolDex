const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {
  try {
    const { addressTokenOne, addressTokenTwo } = req.query;

    // Sanitize
    if (!addressTokenOne || !addressTokenTwo) {
      return res.status(400).json({ error: "No address provided" });
    }

    // TODO Validate addresses

    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTokenOne,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTokenTwo,
    });

    console.log(responseOne);

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return res.status(200).json(usdPrices);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
