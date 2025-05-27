// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navbar = document.getElementById("navbar");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(
      ".service-card, .testimonial-card, .gallery-item, .stat-item, .value-item"
    )
    .forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    counters.forEach((counter) => {
      const target = parseInt(counter.textContent.replace(/\D/g, ""));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = counter.textContent.replace(/\d+/, target);
          clearInterval(timer);
        } else {
          counter.textContent = counter.textContent.replace(
            /\d+/,
            Math.floor(current)
          );
        }
      }, 16);
    });
  }

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector(".about-stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
  }

  // Form handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        // Show success message
        showNotification(
          "Thank you! Your message has been sent. We'll get back to you soon!",
          "success"
        );

        // Reset form
        contactForm.reset();

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${
                  type === "success" ? "fa-check-circle" : "fa-info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#10b981" : "#2563eb"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

    notification.querySelector(".notification-content").style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

    notification.querySelector(".notification-close").style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.style.transform = "translateX(400px)";
        setTimeout(() => notification.remove(), 300);
      });
  }

  // Gallery lightbox functionality
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      const title = this.querySelector("h4").textContent;
      const description = this.querySelector("p").textContent;

      createLightbox(img.src, title, description);
    });
  });

  function createLightbox(imageSrc, title, description) {
    // Create lightbox overlay
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${imageSrc}" alt="${title}">
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;

    // Add styles
    lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

    lightbox.querySelector(".lightbox-content").style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: #1e293b;
            border-radius: 12px;
            overflow: hidden;
            transform: scale(0.8);
            transition: transform 0.3s ease;
            border: 1px solid #334155;
        `;

    lightbox.querySelector(".lightbox-close").style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

    lightbox.querySelector("img").style.cssText = `
            width: 100%;
            height: auto;
            display: block;
        `;

    lightbox.querySelector(".lightbox-info").style.cssText = `
            padding: 20px;
        `;

    // Add to page
    document.body.appendChild(lightbox);

    // Animate in
    setTimeout(() => {
      lightbox.style.opacity = "1";
      lightbox.querySelector(".lightbox-content").style.transform = "scale(1)";
    }, 10);

    // Close functionality
    function closeLightbox() {
      lightbox.style.opacity = "0";
      lightbox.querySelector(".lightbox-content").style.transform =
        "scale(0.8)";
      setTimeout(() => lightbox.remove(), 300);
    }

    lightbox
      .querySelector(".lightbox-close")
      .addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // Testimonials carousel (if more testimonials are added)
  function initTestimonialsCarousel() {
    const testimonialGrid = document.querySelector(".testimonials-grid");
    const testimonials = document.querySelectorAll(".testimonial-card");

    if (testimonials.length > 3) {
      // Add carousel functionality for mobile
      let currentIndex = 0;

      function showTestimonials() {
        if (window.innerWidth <= 768) {
          testimonials.forEach((testimonial, index) => {
            testimonial.style.display =
              index === currentIndex ? "block" : "none";
          });
        } else {
          testimonials.forEach((testimonial) => {
            testimonial.style.display = "block";
          });
        }
      }

      // Create navigation buttons for mobile
      if (window.innerWidth <= 768) {
        const navContainer = document.createElement("div");
        navContainer.className = "testimonial-nav";
        navContainer.innerHTML = `
                    <button class="testimonial-prev"><i class="fas fa-chevron-left"></i></button>
                    <span class="testimonial-counter">${currentIndex + 1} / ${
          testimonials.length
        }</span>
                    <button class="testimonial-next"><i class="fas fa-chevron-right"></i></button>
                `;

        testimonialGrid.parentNode.appendChild(navContainer);

        // Navigation functionality
        navContainer
          .querySelector(".testimonial-prev")
          .addEventListener("click", () => {
            currentIndex =
              currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
            showTestimonials();
            navContainer.querySelector(".testimonial-counter").textContent = `${
              currentIndex + 1
            } / ${testimonials.length}`;
          });

        navContainer
          .querySelector(".testimonial-next")
          .addEventListener("click", () => {
            currentIndex =
              currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
            showTestimonials();
            navContainer.querySelector(".testimonial-counter").textContent = `${
              currentIndex + 1
            } / ${testimonials.length}`;
          });
      }

      showTestimonials();

      // Update on window resize
      window.addEventListener("resize", showTestimonials);
    }
  }

  // Initialize testimonials carousel
  initTestimonialsCarousel();

  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".hero-background");

    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Service card hover effects
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loading");

    // Remove loading class after animation
    setTimeout(() => {
      document.body.classList.remove("loading");
    }, 500);
  });

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2");
      }
      e.target.value = value;
    });
  }

  // Form validation
  function validateForm(form) {
    const inputs = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#ef4444";
        isValid = false;
      } else {
        input.style.borderColor = "#e5e7eb";
      }

      // Email validation
      if (input.type === "email" && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.style.borderColor = "#ef4444";
          isValid = false;
        }
      }
    });

    return isValid;
  }

  // Add validation to form inputs
  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.hasAttribute("required") && !this.value.trim()) {
          this.style.borderColor = "#ef4444";
        } else {
          this.style.borderColor = "#e5e7eb";
        }
      });

      input.addEventListener("focus", function () {
        this.style.borderColor = "#2563eb";
      });
    });
  }

  // Scroll to top functionality
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(100px)";
    }
  });

  // Scroll to top functionality
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add hover effect to scroll to top button
  scrollToTopBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.1)";
  });

  scrollToTopBtn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });

  console.log("Duncan Electric website loaded successfully!");
});
