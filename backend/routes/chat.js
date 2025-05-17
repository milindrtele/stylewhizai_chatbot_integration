const express = require("express");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

const router = express.Router();

const projectId = process.env.DF_PROJECT_ID;
const location = process.env.DF_LOCATION;
const agentId = process.env.DF_AGENT_ID;
const languageCode = "en";

const sessionClient = new SessionsClient({
  keyFilename: process.env.DF_KEYFILE_PATH,
  apiEndpoint: `${location}-dialogflow.googleapis.com`,
});

router.post("/chat", async (req, res) => {
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

module.exports = router;
