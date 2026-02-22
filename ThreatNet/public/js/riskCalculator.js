document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("calculateBtn").addEventListener("click", function () {

    // Get Values 
    let assetInput = document.getElementById("asset");
    let systemsInput = document.getElementById("systems");

    let asset = parseInt(assetInput.value);
    let systems = parseInt(systemsInput.value);
    let privilege = parseInt(document.getElementById("privilege").value);
    let sensitivity = parseInt(document.getElementById("sensitivity").value);
    let exposure = parseInt(document.querySelector('input[name="exposure"]:checked').value);

    // VALIDATION 
    // Asset must be between 1-5
    if (isNaN(asset) || asset < 1 || asset > 5) {
      alert("Asset must be a number between 1 and 5");
      assetInput.focus();
      return;
    }

    // Systems must be between 1-1000000
    if (isNaN(systems) || systems < 1 || systems > 1000000) {
      alert("Systems must be between 1 and 1,000,000");
      systemsInput.focus();
      return;
    }
    //  PARAMETER SCORING 
    // Asset Criticality (1–5 → 0–100)
    let assetScore = (asset / 5) * 100;

    // Privilege Score
    // None=0 | User=40 | Admin=70 | Domain Admin=100
    let privilegeScoreMap = {
      0: 0,
      2: 40,
      4: 70,
      6: 100
    };
    let privilegeScore = privilegeScoreMap[privilege];

    // Exposure Score
    // Internal=30 | VPN=60 | Internet=100
    let exposureScoreMap = {
      1: 30,
      2: 60,
      3: 100
    };
    let exposureScore = exposureScoreMap[exposure];

    // Data Sensitivity Score
    // Public=20 | Internal=40 | Confidential=70 | PII=85 | Financial=100
    let sensitivityScoreMap = {
      1: 20,
      2: 40,
      3: 70,
      4: 85,
      5: 100
    };
    let sensitivityScore = sensitivityScoreMap[sensitivity];

    // Affected Systems (Tier-Based)
    let systemScore = 0;

    if (systems <= 20) {
      systemScore = 20;
    } else if (systems <= 100) {
      systemScore = 40;
    } else if (systems <= 500) {
      systemScore = 70;
    } else {
      systemScore = 100;
    }


    //  FINAL WEIGHTED RISK 
    let risk =
      (assetScore * 0.25) +
      (privilegeScore * 0.25) +
      (exposureScore * 0.20) +
      (sensitivityScore * 0.20) +
      (systemScore * 0.10);

    risk = Math.round(risk);

 
    // RISK LEVELS 
    let level = "";
    let colorClass = "";

    if (risk <= 25) {
      level = "Low";
      colorClass = "low";
    } else if (risk <= 50) {
      level = "Medium";
      colorClass = "medium";
    } else if (risk <= 75) {
      level = "High";
      colorClass = "high";
    } else {
      level = "Critical";
      colorClass = "critical";
    }


    //  UPDATE UI 
    let resultBox = document.getElementById("resultBox");
    resultBox.className = "result-box";
    resultBox.classList.remove("hidden");

    resultBox.innerHTML = `
      <div class="risk-header">
        Overall Risk Score
      </div>

      <div class="risk-main">
        <div class="risk-number">${risk}</div>
        <div class="risk-badge ${colorClass}">${level}</div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill ${colorClass}" 
             style="width:${risk}%;">
        </div>
      </div>
    `;

  });

});
