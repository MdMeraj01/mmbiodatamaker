// format.js – template specific config (currently informational)
// This file does not change any behaviour; it simply exposes
// metadata for Format 2 so you can use it later if needed.

window.BIODATA_TEMPLATES = window.BIODATA_TEMPLATES || {};

window.BIODATA_TEMPLATES["2"] = {
  id: 2,
  key: "green-elegant",
  displayName: "Format 2 – Green Elegant",
  primaryColor: "#15803d",
  borderImage: "format2.jpg",
  description: "Clean white background with classic green ornamental border."
};

// Example: if you ever want to log when Format 2 is selected
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("formatsPhotoGrid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".select-format-btn");
    if (!btn) return;

    const fid = btn.dataset.format;
    if (fid === "2") {
      console.log("Format 2 selected:", window.BIODATA_TEMPLATES["2"]);
      // yahan future me koi special behaviour add kar sakte ho
    }
  });
});

// format.js – template specific meta / hooks

window.BIODATA_TEMPLATES = window.BIODATA_TEMPLATES || {};

window.BIODATA_TEMPLATES["2"] = {
  id: 2,
  key: "green-elegant",
  displayName: "Format 2 – Green Elegant",
  primaryColor: "#16a34a",
  borderImage: "format2.jpg",
  description: "Clean white page with classic green ornamental border."
};

window.BIODATA_TEMPLATES["3"] = {
  id: 3,
  key: "blue-royal",
  displayName: "Format 3 – Blue Royal",
  primaryColor: "#1d4ed8",
  borderImage: "format3.jpg",
  description: "White background with royal blue floral corners and border."
};

// Optional: just to see in console when user selects a format
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("formatsPhotoGrid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".select-format-btn");
    if (!btn) return;

    const fid = btn.dataset.format;
    const meta = window.BIODATA_TEMPLATES[fid];
    if (meta) {
      console.log("Selected template:", meta.displayName, meta);
      // yaha agar future me koi special behaviour chahiye
      // (jaise default color, extra field, etc.) to add kar sakte ho
    }
  });
});


window.BIODATA_TEMPLATES = window.BIODATA_TEMPLATES || {};

window.BIODATA_TEMPLATES["4"] = {
  id: 4,
  key: "teal-gold",
  displayName: "Format 4 – Teal & Gold (Cambria)",
  primaryColor: "#facc15",
  borderImage: "format4.jpg",
  description: "Deep teal textured background with elegant gold ornaments."
};

window.BIODATA_TEMPLATES["5"] = {
  id: 5,
  key: "gold-classic",
  displayName: "Format 5 – Classic Gold Border",
  primaryColor: "#b45309",
  borderImage: "format5.jpg",
  description: "Minimal white layout with elegant golden frame and serif typography."
};
window.BIODATA_TEMPLATES["5"] = {
  id: 5,
  key: "gold-classic",
  displayName: "Format 5 – Classic Gold Border",
  primaryColor: "#b45309",
  borderImage: "format5.jpg",
  description: "Minimal white layout with elegant golden frame and serif typography."
};

window.BIODATA_TEMPLATES["6"] = {
  id: 6,
  key: "islamic-floral-bismillah",
  displayName: "Format 6 – Islamic Floral (Bismillah)",
  primaryColor: "#b45309",
  borderImage: "format6.jpg",
  description: "Soft floral frame with Bismillah on top; all biodata content starts below the calligraphy."
};

window.BIODATA_TEMPLATES["7"] = {
  id: 7,
  key: "gold-bismillah-frame",
  displayName: "Format 7 – Golden Bismillah Frame",
  primaryColor: "#a07017",
  borderImage: "format7.jpg",
  description: "Golden calligraphy frame with content starting only below the Bismillah."
};
