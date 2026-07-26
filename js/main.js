document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.right = '20px';
        navLinks.style.background = '#16161f';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '8px';
      }
    });
  }

  // 2. Minimalist Neon Thunderstorm Effect (Main Page Only)
  const canvas = document.getElementById('stormCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Minimalist Rain Particles
    const rainCount = 40;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.4 + 0.1
    }));

    // Lightning State
    let bolt = null;
    let flashAlpha = 0;

    function createBolt() {
      let startX = Math.random() * width;
      let points = [{ x: startX, y: 0 }];
      let currentX = startX;
      let currentY = 0;

      while (currentY < height * 0.7) {
        currentX += (Math.random() - 0.5) * 40;
        currentY += Math.random() * 30 + 15;
        points.push({ x: currentX, y: currentY });
      }

      return { points, life: 12 };
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Random Lightning Trigger
      if (!bolt && Math.random() < 0.008) { 
        bolt = createBolt();
        flashAlpha = 0.15;
      }

      // Ambient Flash Pulse
      if (flashAlpha > 0) {
        ctx.fillStyle = `rgba(0, 255, 102, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha -= 0.015;
      }

      // Neon Lightning Bolt
      if (bolt) {
        ctx.beginPath();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff66';

        for (let i = 0; i < bolt.points.length - 1; i++) {
          ctx.moveTo(bolt.points[i].x, bolt.points[i].y);
          ctx.lineTo(bolt.points[i + 1].x, bolt.points[i + 1].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        bolt.life--;
        if (bolt.life <= 0) bolt = null;
      }

      // Rain Lines
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 1;
      for (let drop of drops) {
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(render);
    }

    render();
  }
});

// --- Custom Neon Glowing Cursor (Auto-Injects on All Pages) ---
function initCustomCursor() {
  // Check if touch device / mobile (don't run on mobile)
  if (window.innerWidth <= 768) return;

  // Create and inject cursor HTML dynamically if not present
  if (!document.getElementById('cursorDot')) {
    const dot = document.createElement('div');
    dot.id = 'cursorDot';
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.id = 'cursorRing';
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(ring);
  }

  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth trailing effect for ring
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand cursor when hovering interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Run cursor setup once DOM is ready
document.addEventListener('DOMContentLoaded', initCustomCursor);

// --- Live Countdown Timer ---
const targetDate = new Date('October 24, 2026 09:00:00').getTime();

function updateCountdown() {
  const daysEl = document.getElementById('days');
  if (!daysEl) return; // Exit if not on homepage

  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
  } else {
    document.querySelector('.countdown-section').innerHTML = '<h2 class="countdown-title">MIMUN 2026 IS LIVE!</h2>';
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- Chairs Modal Functionality ---
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('chairsModal');
  const modalClose = document.getElementById('modalClose');
  const commCards = document.querySelectorAll('.committee-card');

  if (modal) {
    // Function to close modal
    const closeModal = () => {
      modal.classList.remove('active');
    };

    // Open modal on card click
    commCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const targetCard = e.currentTarget;
        
        const commName = targetCard.getAttribute('data-committee') || 'Committee';
        const chair1Name = targetCard.getAttribute('data-chair1-name') || 'TBD';
        const chair1Role = targetCard.getAttribute('data-chair1-role') || 'Chair';
        const chair1Img = targetCard.getAttribute('data-chair1-img') || '';

        const chair2Name = targetCard.getAttribute('data-chair2-name') || 'TBD';
        const chair2Role = targetCard.getAttribute('data-chair2-role') || 'Vice Chair';
        const chair2Img = targetCard.getAttribute('data-chair2-img') || '';

        // Populate Modal Elements
        document.getElementById('modalCommitteeName').innerText = commName + ' — Executive Board';
        
        document.getElementById('chair1Name').innerText = chair1Name;
        document.getElementById('chair1Role').innerText = chair1Role;
        document.getElementById('chair1Img').src = chair1Img;

        document.getElementById('chair2Name').innerText = chair2Name;
        document.getElementById('chair2Role').innerText = chair2Role;
        document.getElementById('chair2Img').src = chair2Img;

        // Show Modal
        modal.classList.add('active');
      });
    });

    // Close button click
    if (modalClose) {
      modalClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents click event issues
        closeModal();
      });
    }

    // Close when clicking outside the modal box
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close when pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
