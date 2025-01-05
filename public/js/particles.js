// Characters to randomly use for particles
const asciiChars = ['.', '*', 'o', '+', 'x', '~', '`', '^'];

// Number of particles
const particleCount = 50;

// Grab container
const container = document.getElementById('asciiContainer');

// Container bounding box (for random spawn positioning)
// We'll get updated bounds later if needed
let containerRect = container.getBoundingClientRect();

// Create a bunch of particles initially
for (let i = 0; i < particleCount; i++) {
  createParticle();
}

function createParticle() {
  // Create the span for our particle
  const particle = document.createElement('span');
  particle.classList.add('particle');

  // Choose a random ASCII char
  particle.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];

  // Random initial position
  // We add containerRect.width/height so it floats around the container area
  const x = Math.random() * containerRect.width;
  const y = Math.random() * containerRect.height;

  particle.style.left = x + 'px';
  particle.style.top = y + 'px';

  // Random color
  particle.style.color = randomColor();

  // Random horizontal movement speed/direction
  // We'll store these speeds in dataset so we can update easily
  particle.dataset.vx = (Math.random() - 0.5) * 0.4; 
  particle.dataset.vy = (Math.random() - 0.5) * 0.4; 

  container.appendChild(particle);
}

// A function to return a random color in #RRGGBB format
function randomColor() {
  const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Animation loop using requestAnimationFrame
function animateParticles() {
  const particles = document.querySelectorAll('.particle');
  
  // In case window resizes, update containerRect
  containerRect = container.getBoundingClientRect();


  particles.forEach((p) => {
    let x = parseFloat(p.style.left);
    let y = parseFloat(p.style.top);

    let vx = parseFloat(p.dataset.vx);
    let vy = parseFloat(p.dataset.vy);

    // Update positions
    x += vx;
    y += vy;

    // If a particle goes outside the container, wrap it around
    if (x < 10) x = containerRect.width - 50;
    if (x > containerRect.width - 10) x = 10;
    if (y < 10) y = containerRect.height - 25;
    if (y > containerRect.height - 10) y = 10;
    // Save updated positions
    p.style.left = x + 'px';
    p.style.top = y + 'px';
  });

  // Keep animating
  requestAnimationFrame(animateParticles);
}

// Start the animation
animateParticles();

