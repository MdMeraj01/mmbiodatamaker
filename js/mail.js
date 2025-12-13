

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm(
    "service_4lfyacf",   // 👈 service ID
    "template_ojv900a",  // 👈 template ID
    this
  )
  .then(function() {
    alert("✅ Message sent successfully!");
    document.getElementById("contactForm").reset();
  }, function(error) {
    alert("❌ Failed to send message. Try again.");
    console.error(error);
  });
});

