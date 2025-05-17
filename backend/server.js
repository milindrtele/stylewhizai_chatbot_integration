require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const chatRoutes = require("./routes/chat");
const webhookRoutes = require("./routes/webhooks");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use("/", chatRoutes);
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
