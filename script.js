document.addEventListener("DOMContentLoaded", function () {
    const curtainSection = document.getElementById("curtainSection");
    const mainContent = document.getElementById("mainContent");

    curtainSection.addEventListener("click", () => {
        curtainSection.classList.add("open");
        mainContent.classList.remove("hidden");
        setTimeout(() => {
            curtainSection.style.display = "none";
        }, 1800);
    });

    const canvases = [
        { id: 'canvasDay', text: 'Dita' },
        { id: 'canvasMonth', text: 'Muaji' },
        { id: 'canvasYear', text: 'Viti' }
    ];

    let scratchedCount = 0;
    const totalCanvases = canvases.length;
    let completed = {};

    canvases.forEach(item => {
        const canvas = document.getElementById(item.id);
        const ctx = canvas.getContext("2d");
        completed[item.id] = false;

        let grad = ctx.createLinearGradient(0, 0, 100, 100);
        grad.addColorStop(0, '#e6ca91');
        grad.addColorStop(0.5, '#cfa85b');
        grad.addColorStop(1, '#9a752c');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.text, 50, 50);

        let isDrawing = false;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX || e.touches[0].clientX) - rect.left,
                y: (e.clientY || e.touches[0].clientY) - rect.top
            };
        }

        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getMousePos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
            ctx.fill();
            checkPercentage(canvas, item.id);
        }

        canvas.addEventListener("mousedown", () => isDrawing = true);
        canvas.addEventListener("mouseup", () => isDrawing = false);
        canvas.addEventListener("mousemove", scratch);
        canvas.addEventListener("touchstart", () => isDrawing = true);
        canvas.addEventListener("touchend", () => isDrawing = false);
        canvas.addEventListener("touchmove", scratch);
    });

    function checkPercentage(canvas, id) {
        if (completed[id]) return;
        const ctx = canvas.getContext("2d");
        const imgData = ctx.getImageData(0, 0, 100, 100);
        let hits = 0;
        for (let i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i + 3] === 0) hits++;
        }
        if (hits > (imgData.data.length / 4) * 0.45) {
            completed[id] = true;
            canvas.style.pointerEvents = 'none';
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 0.5s';
            scratchedCount++;

            if (scratchedCount === totalCanvases) {
                triggerCelebration();
            }
        }
    }

    function triggerCelebration() {
        document.getElementById("marriageText").classList.add("show");
        startFireworks();
    }

    // Countdown (7 Korrik 2026)
    const targetDate = new Date("July 7, 2026 00:00:00").getTime();

    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

        if (difference < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "Sot është Dita e Nikahut!";
        }
    }, 1000);

    // Fishekzjarret
    const fwCanvas = document.getElementById("fireworksCanvas");
    const fwCtx = fwCanvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        fwCanvas.width = window.innerWidth;
        fwCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.radius = Math.random() * 3 + 1;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
        }
        draw() {
            fwCtx.save();
            fwCtx.globalAlpha = this.alpha;
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.fill();
            fwCtx.restore();
        }
        update() {
            this.velocity.y += 0.04;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.015;
        }
    }

    function spawnFirework() {
        const x = Math.random() * fwCanvas.width;
        const y = Math.random() * (fwCanvas.height * 0.6);
        const colors = ['#dfba6b', '#841c1c', '#ff5757', '#ffd700', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    let animationId;
    function animateFireworks() {
        animationId = requestAnimationFrame(animateFireworks);
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

        particles.forEach((p, index) => {
            if (p.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                p.update();
                p.draw();
            }
        });
    }

    let fireworkTimer;
    function startFireworks() {
        animateFireworks();
        fireworkTimer = setInterval(spawnFirework, 400);
        setTimeout(() => {
            clearInterval(fireworkTimer);
            setTimeout(() => cancelAnimationFrame(animationId), 3000);
        }, 7000);
    }
});