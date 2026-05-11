(() => {
  "use strict";

  // 1. FAQ accordion
  document.querySelectorAll(".faq-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;

      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  // 2. Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("nav-menu")?.classList.remove("open");
      }
    });
  });

  // 3. Mobile hamburger
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 4. Nav solid on scroll
  const nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener(
      "scroll",
      () => {
        nav.classList.toggle("nav--solid", window.scrollY > 60);
      },
      { passive: true }
    );
  }

  // 5. Hero form -> Google Sheets (Apps Script) + WhatsApp fallback
  const heroForm = document.getElementById("hero-form");
  const heroFormFeedback = document.getElementById("hero-form-feedback");

  async function sendLeadToGoogleSheets(endpoint, payload) {
    // Apps Script usually requires no-cors when called from static websites.
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  function openWhatsAppLead(nome, wp, fat) {
    const text = [
      "Ola, Zuno!",
      `Me chamo *${nome}*.`,
      fat ? `Faturamento mensal: *${fat}*.` : "",
      `Meu WhatsApp: ${wp}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/5545999999999?text=${encodeURIComponent(text)}`, "_blank");
  }

  function setFeedback(message, color) {
    if (!heroFormFeedback) return;
    heroFormFeedback.textContent = message;
    if (color) heroFormFeedback.style.color = color;
  }

  if (heroForm) {
    heroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("h-nome")?.value.trim() ?? "";
      const wp = document.getElementById("h-wp")?.value.trim() ?? "";
      const fat = document.getElementById("h-fat")?.value ?? "";
      const sheetEndpoint = heroForm.dataset.sheetEndpoint?.trim() ?? "";
      const submitBtn = heroForm.querySelector('button[type="submit"]');

      if (!nome || !wp) {
        setFeedback("Preencha seu nome e WhatsApp.", "#ef4444");
        return;
      }

      const payload = {
        nome,
        whatsapp: wp,
        faturamento: fat || "",
        origem: "landing-page-zuno",
        pagina: window.location.href,
        criadoEm: new Date().toISOString(),
      };

      if (!sheetEndpoint) {
        setFeedback("Endpoint do Google Sheets nao configurado. Abrindo WhatsApp...", "#f59e0b");
        openWhatsAppLead(nome, wp, fat);
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando...";
        }

        await sendLeadToGoogleSheets(sheetEndpoint, payload);
        setFeedback("Recebemos seus dados. Em breve nosso time entra em contato.", "#22c55e");
        heroForm.reset();
      } catch (error) {
        setFeedback("Nao foi possivel enviar para a planilha. Abrindo WhatsApp...", "#ef4444");
        openWhatsAppLead(nome, wp, fat);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Quero mais informações";
        }
      }

    });
  }

  // 6. Show hamburger on mobile
  function checkMobile() {
    if (!navToggle || !navMenu) return;
    const mobile = window.innerWidth <= 767;
    navToggle.style.display = mobile ? "flex" : "none";
    if (!mobile) navMenu.classList.remove("open");
  }

  checkMobile();
  window.addEventListener("resize", checkMobile);
})();
