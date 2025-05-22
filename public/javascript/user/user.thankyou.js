document.addEventListener("DOMContentLoaded", function() {
    const fireworksContainer = document.getElementById('fireworks');

    function createFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        firework.style.width = `${Math.random() * 50 + 10}px`;
        firework.style.height = firework.style.width;
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        firework.style.animation = `explode 3s ease-out forwards`; // Set to 3 seconds

        fireworksContainer.appendChild(firework);

        // Remove the firework after the animation ends
        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }

    // Create multiple fireworks at random positions
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createFirework(x, y);
    }
});
setTimeout(() => {
    window.location.href = "/";
}, 2000);