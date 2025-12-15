 // pdf.js – Single PDF flow for all formats (High Quality + Clickable Link Fix)
// Uses: html2canvas + jsPDF loaded lazily

let pdfLibPromise = null;

// Load html2canvas + jsPDF once
function loadPdfLibraries() {
  if (pdfLibPromise) return pdfLibPromise;

  pdfLibPromise = new Promise((resolve, reject) => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];

    let loaded = 0;

    function onLoad() {
      loaded++;
      if (loaded === scripts.length) {
        if (window.jspdf && window.jspdf.jsPDF) {
          window.jsPDF = window.jspdf.jsPDF;
          resolve();
        } else {
          reject(new Error("jsPDF not available."));
        }
      }
    }

    function onError(src) {
      reject(new Error("Failed to load " + src));
    }

    scripts.forEach(src => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = onLoad;
      s.onerror = () => onError(src);
      document.head.appendChild(s);
    });
  });

  return pdfLibPromise;
}

// ---------- MAIN PDF FUNCTION ----------
async function generateAndDownloadPdf(data) {
  await loadPdfLibraries();

  if (typeof validateRequired === "function") {
    if (!validateRequired()) return;
  }

  // latest form data
  data = data || collectFormData();

  // preview ko update rakho
  if (typeof updatePreview === "function") {
    updatePreview(data);
  }

  // card element (jo preview me dikhta)
  const card = document.querySelector("#previewArea .biodata-template");
  if (!card) {
    showToast("Please generate the preview first.");
    return;
  }

  // PDF mode ON
  document.body.classList.add("pdf-mode");

  // --- STEP 1: CLONE & RESET SCALE (Quality Fix) ---
  // Preview me card chhota (scaled) ho sakta hai, par PDF me full size chahiye.
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = "794px";  // A4 Width Fix
  wrapper.style.zIndex = "-1";

  const clone = card.cloneNode(true);
  
  // IMPORTANT: Scaling hatao taaki PDF dhundhla na ho
  clone.style.transform = "none"; 
  clone.style.margin = "0";
  clone.style.width = "100%";
  clone.style.boxShadow = "none";
  
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    showToast("Preparing High Quality PDF...");

    // --- STEP 2: CAPTURE IMAGE ---
    const canvas = await html2canvas(wrapper, {
      scale: 2, // 2x Quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff" // Transparent background issue fix
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Image Dimensions Calculation
    const pxWidth = canvas.width;
    const pxHeight = canvas.height;

    // Aspect Ratio maintain karte hue fit karo
    const ratio = Math.min(pageWidth / pxWidth, pageHeight / pxHeight);
    const imgWidth = pxWidth * ratio;
    const imgHeight = pxHeight * ratio;

    // Center Align Calculation
    const marginX = (pageWidth - imgWidth) / 2;
    const marginY = (pageHeight - imgHeight) / 2;

    // PDF me Image dalo
    pdf.addImage(imgData, "JPEG", marginX, marginY, imgWidth, imgHeight, "", "FAST");

    // --- STEP 3: CLICKABLE LINK MATHS (The Fix) ---
    // Link ko image ke bottom hisse par chipkana hai
    
    // Footer ki height approx 15mm hoti hai
    const footerHeight = 15; 
    
    // Calculate Y Position: Jahan Image shuru hui + Image ki Height - Footer Height
    const linkY = marginY + imgHeight - footerHeight;

    // Link add karo (Invisible Clickable Box)
    pdf.link(marginX, linkY, imgWidth, footerHeight, { url: "https://mmbiodatamaker.netlify.app/" });

    // ----------------------------------------------

    const safeName = (data.name || "user").replace(/\s+/g, "_").toLowerCase();
    const ymd = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const filename = `marriage_biodata_${safeName}_${ymd}.pdf`;

    pdf.save(filename);
    showToast("PDF downloaded successfully!");
  } catch (err) {
    console.error(err);
    showToast("Error generating PDF. Please try again.");
  } finally {
    wrapper.remove();
    document.body.classList.remove("pdf-mode");
  }
}

// ---------- BUTTON HANDLERS ----------
document.addEventListener("DOMContentLoaded", () => {
  const payDownloadBtn = document.getElementById("payDownloadBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const sendEmailBtn   = document.getElementById("sendEmailBtn");

  const paymentModal   = document.getElementById("paymentModal");
  const closeModal     = document.getElementById("closeModal");
  const cancelPayment  = document.getElementById("cancelPayment");
  const simulatePayBtn = document.getElementById("simulatePayBtn");
  const paymentStatus  = document.getElementById("paymentStatus");

  function openPaymentModal() {
    if (!paymentModal) return;
    paymentModal.setAttribute("aria-hidden", "false");
    paymentModal.style.display = "flex";
    if (paymentStatus) paymentStatus.textContent = "";
    if (simulatePayBtn) simulatePayBtn.disabled = false;
  }

  function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.setAttribute("aria-hidden", "true");
    paymentModal.style.display = "none";
    if (paymentStatus) paymentStatus.textContent = "";
    if (simulatePayBtn) simulatePayBtn.disabled = false;
  }

  // Pay & Download
  if (payDownloadBtn) {
    payDownloadBtn.addEventListener("click", () => {
      if (typeof validateRequired === "function") {
        if (!validateRequired()) return;
      }
      openPaymentModal();
    });
  }

  if (closeModal) closeModal.addEventListener("click", closePaymentModal);
  if (cancelPayment) cancelPayment.addEventListener("click", closePaymentModal);

  if (paymentModal) {
    paymentModal.addEventListener("click", (e) => {
      if (e.target === paymentModal) closePaymentModal();
    });
  }

  if (simulatePayBtn) {
    simulatePayBtn.addEventListener("click", () => {
      if (paymentStatus) paymentStatus.textContent = "Processing payment...";
      simulatePayBtn.disabled = true;

      setTimeout(() => {
        if (paymentStatus) paymentStatus.textContent = "Payment successful — generating PDF";
        showToast("Payment successful — generating PDF");

        setTimeout(() => {
          closePaymentModal();
          simulatePayBtn.disabled = false;
          generateAndDownloadPdf();
        }, 800);
      }, 1200);
    });
  }

  // Direct Download button
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      generateAndDownloadPdf();
    });
  }

  // Email (simulated)
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      if (typeof validateRequired === "function") {
        if (!validateRequired()) return;
      }
      showToast("Simulated: PDF sent to your email (demo).");
    });
  }

  window.generateAndDownloadPdf = generateAndDownloadPdf;
});

/* =========================================
   PROGRESS BAR LOGIC
   ========================================= */
function updateProgressBar() {
  const form = document.getElementById('biodataForm');
  if(!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  let total = 0;
  let filled = 0;

  inputs.forEach(input => {
    // Hidden aur Buttons ko count mat karo
    if(input.type !== 'hidden' && input.type !== 'button' && input.type !== 'submit') {
      total++;
      if(input.value.trim() !== '') {
        filled++;
      }
    }
  });

  const percentage = Math.round((filled / total) * 100);
  
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  
  if(bar && text) {
    bar.style.width = `${percentage}%`;
    text.textContent = `${percentage}%`;
    
    // Color change based on progress
    if(percentage < 30) bar.style.background = '#ef4444'; // Red
    else if(percentage < 70) bar.style.background = '#eab308'; // Yellow
    else bar.style.background = '#22c55e'; // Green
  }
}

// Event Listeners add karo
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('biodataForm');
  if(form) {
    form.addEventListener('input', updateProgressBar);
    // Initial call (agar auto-save data hai to)
    setTimeout(updateProgressBar, 500);
  }
});