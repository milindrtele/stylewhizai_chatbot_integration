// backend/server.js
const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

const app = express();
app.use(cors());
app.use(express.json());

const projectId = "stylewhizai";
const location = "asia-south1";
const agentId = "45caf350-8eae-4459-98cc-6fe003cdc143";
const languageCode = "en";

const sessionClient = new SessionsClient({
  keyFilename: "./keys/stylewhizai-225545aaaa1d.json",
  apiEndpoint: "asia-south1-dialogflow.googleapis.com",
});

app.post("/chat", async (req, res) => {
  console.log(req.body);
  const { text, sessionId } = req.body;

  const sessionPath = sessionClient.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
      },
      languageCode,
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const reply = response.queryResult.responseMessages
      .map((msg) => msg.text?.text?.[0])
      .filter(Boolean)
      .join(" ");

    res.json({ reply });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
