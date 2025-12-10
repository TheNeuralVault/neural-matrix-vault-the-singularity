console.log("/// NEURAL MATRIX: ONLINE");

// Simple Interaction Sound
const playSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

// Bind to Buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', playSound);
});

// Canvas Background (Lightweight)
const canvas = document.getElementById('neural-engine');
if(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = Array(50).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));

    function animate() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f3ff';
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.fillRect(p.x, p.y, 2, 2);
        });
        requestAnimationFrame(animate);
    }
    animate();
}
