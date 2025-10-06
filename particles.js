// === Animation du fond de particules avec halo lumineux ===
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

// Gestion de la taille du canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Couleurs des particules
const colors = ['#ff6b00', '#ff006e', '#ffd700', '#ff2d55'];

// Création des particules
function createParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.7,
            dy: (Math.random() - 0.5) * 0.7,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}
createParticles();

// Suivi de la souris pour le halo
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Dessin du halo lumineux
function drawHalo() {
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.3, 'rgba(255, 107, 0, 0.2)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Animation des particules
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Particules
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Déplacement
        p.x += p.dx;
        p.y += p.dy;

        // Rebond aux bords
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    // Halo lumineux
    drawHalo();

    requestAnimationFrame(animateParticles);
}
animateParticles();
