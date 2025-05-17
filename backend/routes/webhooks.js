const express = require("express");
const router = express.Router();

// in this initial_greeting request we can set the initial parameters that may have been collected from the UI
//bodyParameters_complete is set to "TRUE", then all the parameters must be filled
// same is true for account_details and its parameters

router.post("/initial_greeting", (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};
  res.json({
    session_info: {
      parameters: {
        ///////all the entities from dialogflow
        ////////user profile details
        // accountDetails_complete: "TRUE",
        // first_name: "m",
        // last_name: "xyz",
        // email_id: "abc",
        /////////user body parameters
        // bodyParameters_complete: "TRUE",
        // face_type: "",
        // hip_size: "",
        // gender: "",
        // high_hip_size: "",
        // height: "",
        // skin_tone: "",
        // bust_size: "",
        // waist_size: "",
        // body_type: "",
        // age_group: "",
        ////////user undertone calculations
        //   vein_color: "",
        //   clothing_preference: "",
        //   sunReaction: "",
        //   jewelryPreference: "",
        //   skin_undertone: "",
        ///////occation datails
        //   occasion: "",
        //   party_type: "",
      },
    },
  });
});

router.post("/userDetails", (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};
  res.json({
    session_info: {
      parameters: {
        email: "example@example.com",
      },
    },
  });
});

router.post("/bodyParameters", (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};

  function calculateBodyType({ bust_size, waist_size, hip_size }) {
    if (!bust_size || !waist_size || !hip_size) {
      return "rectangle";
    }

    function safeNumber(value) {
      const num = parseFloat(value);
      return Number.isFinite(num) ? num : null;
    }

    // Usage
    const bust = safeNumber(bust_size);
    const waist = safeNumber(waist_size);
    const hips = safeNumber(hip_size);

    if (bust === null || waist === null || hips === null) {
      return "rectangle"; // Or throw an error, or handle invalid input
    }

    const bustHipDiff = Math.abs(bust - hips);
    const bustHipAvg = (bust + hips) / 2;
    const waistToBust = waist / bust;
    const waistToHips = waist / hips;

    // Hourglass: bust ≈ hips and waist significantly smaller
    if (
      bustHipDiff / bustHipAvg <= 0.05 &&
      waistToBust < 0.75 &&
      waistToHips < 0.75
    ) {
      return "hourglass";
    }

    // Pear: hips more than 5% bigger than bust
    if (hips > bust * 1.05) {
      return "pear";
    }

    // Inverted triangle: bust more than 5% bigger than hips
    if (bust > hips * 1.05) {
      return "inverted triangle";
    }

    // Apple: waist is equal or wider than bust or hips
    if (waist >= bust || waist >= hips) {
      return "apple";
    }

    // Rectangle: bust, waist, hips all close, and waist not small enough for hourglass
    return "rectangle";
  }

  // Example usage
  const userMeasurements = {
    face_type: parameters.face_type,
    hip_size: parameters.hip_size,
    gender: parameters.gender,
    high_hip_size: parameters.high_hip_size,
    height: parameters.height,
    skin_tone: parameters.skin_tone,
    bust_size: parameters.bust_size,
    waist_size: parameters.waist_size,
    body_type: parameters.body_type,
    age_group: parameters.age_group,
  };

  parameters.body_type = calculateBodyType(userMeasurements);

  res.json({
    session_info: {
      parameters: {
        ...parameters,
      },
    },
  });
});

router.post("/definingUndertone", (req, res) => {
  const params = req.body.sessionInfo?.parameters || {};

  function detectUndertone(params) {
    const values = [
      params.vein_color,
      params.jewelrypreference,
      params.sunreaction,
      params.clothing_preference,
    ];

    const score = { warm: 0, cool: 0, neutral: 0 };

    values.forEach((val) => {
      if (val && score[val] !== undefined) {
        score[val]++;
      }
    });

    // Determine final undertone
    let max = 0;
    let final = "neutral"; // default
    for (let tone in score) {
      if (score[tone] > max) {
        max = score[tone];
        final = tone;
      }
    }

    return final; // "cool", "warm", or "neutral"
  }

  const undertone = detectUndertone(params);

  res.json({
    session_info: {
      parameters: {
        skin_undertone: undertone,
      },
    },
  });
});

router.post("/apparel_requirement", (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};
  res.json({
    session_info: {
      parameters: {
        ...parameters,
      },
    },
  });
  console.log(parameters);
});

module.exports = router;
