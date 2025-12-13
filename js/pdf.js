// pdf.js – Single PDF flow for all formats (1,2,...)
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

// ---------- MAIN PDF FUNCTION (sab formats ke liye) ----------
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

  // PDF mode ON -> mobile CSS override nahi lagega
  document.body.classList.add("pdf-mode");

  // off-screen wrapper
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.background = "transparent";
  wrapper.style.width = "794px";  // approx A4 width @96dpi
  wrapper.style.padding = "0";
  wrapper.style.margin = "0";
  wrapper.style.zIndex = "-1";

  const clone = card.cloneNode(true);
  clone.style.margin = "0 auto";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    showToast("Preparing PDF...");

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // image ko page me fit karo without stretch
    const pxWidth = canvas.width;
    const pxHeight = canvas.height;

    const ratio = Math.min(pageWidth / pxWidth, pageHeight / pxHeight);
    const imgWidth = pxWidth * ratio;
    const imgHeight = pxHeight * ratio;

    const marginX = (pageWidth - imgWidth) / 2;
    const marginY = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "JPEG", marginX, marginY, imgWidth, imgHeight, "", "FAST");

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

  // optional global
  window.generateAndDownloadPdf = generateAndDownloadPdf;
});