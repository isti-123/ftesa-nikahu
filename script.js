document.addEventListener("DOMContentLoaded", function () {

    const DB_URL = "https://kvdb.io/MN86Sg8vGskvX8XwLg6mRE/rsvp_records";

    // ===== CURTAIN =====
    const curtainSection = document.getElementById("curtainSection");
    const mainContent = document.getElementById("mainContent");
    const openBtn = document.getElementById("openBtn");

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            curtainSection.classList.add("open");
            mainContent.classList.remove("hidden");
            handleScrollReveal();
        });
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll(".scroll-reveal");

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.9;
        revealElements.forEach(el => {
            if (el.id === "page3" && el.classList.contains("hidden-countdown")) return;
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) el.classList.add("visible");
        });
    }
    window.addEventListener("scroll", handleScrollReveal);

    // ===== SCRATCH CARDS =====
    const canvases = [
        { id: 'canvasDay', text: 'Dita' },
        { id: 'canvasMonth', text: 'Muaji' },
        { id: 'canvasYear', text: 'Viti' }
    ];
    let scratchedCount = 0;
    let completed = {};

    canvases.forEach(item => {
        const canvas = document.getElementById(item.id);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        completed[item.id] = false;

        let grad = ctx.createLinearGradient(0, 0, 100, 100);
        grad.addColorStop(0, '#e6ca91'); grad.addColorStop(0.5, '#cfa85b'); grad.addColorStop(1, '#9a752c');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(50, 50, 50, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(item.text, 50, 50);

        let isDrawing = false;
        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            return { x: (e.clientX || e.touches[0].clientX) - rect.left, y: (e.clientY || e.touches[0].clientY) - rect.top };
        }
        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getMousePos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2); ctx.fill();
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
        for (let i = 0; i < imgData.data.length; i += 4) { if (imgData.data[i + 3] === 0) hits++; }
        if (hits > (imgData.data.length / 4) * 0.45) {
            completed[id] = true; canvas.style.pointerEvents = 'none'; canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 0.5s'; scratchedCount++;
            if (scratchedCount === canvases.length) triggerCelebration();
        }
    }

    function triggerCelebration() {
        document.getElementById("marriageText").classList.add("show");
        const countdownPage = document.getElementById("page3");
        if (countdownPage) {
            countdownPage.classList.remove("hidden-countdown");
            countdownPage.classList.add("show-countdown");
            setTimeout(() => { countdownPage.classList.add("visible"); handleScrollReveal(); }, 50);
        }
        startFireworks();
    }

    // ===== COUNTDOWN =====
    const targetDate = new Date("July 7, 2026 00:00:00").getTime();
    setInterval(function () {
        const now = new Date().getTime(); const difference = targetDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const dEl = document.getElementById("days"); const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes"); const sEl = document.getElementById("seconds");
        if (dEl) dEl.innerHTML = days < 10 ? "0" + days : days;
        if (hEl) hEl.innerHTML = hours < 10 ? "0" + hours : hours;
        if (mEl) mEl.innerHTML = minutes < 10 ? "0" + minutes : minutes;
        if (sEl) sEl.innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);

    // ===== FIREWORKS =====
    const fwCanvas = document.getElementById("fireworksCanvas");
    let fwCtx = fwCanvas ? fwCanvas.getContext("2d") : null;
    let particles = [];

    function resizeCanvas() {
        if (fwCanvas) { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color; this.radius = Math.random() * 3 + 1;
            this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 }; this.alpha = 1;
        }
        draw() {
            if (!fwCtx) return;
            fwCtx.save(); fwCtx.globalAlpha = this.alpha; fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color; fwCtx.fill(); fwCtx.restore();
        }
        update() { this.velocity.y += 0.04; this.x += this.velocity.x; this.y += this.velocity.y; this.alpha -= 0.015; }
    }

    function spawnFirework() {
        if (!fwCanvas) return;
        const x = Math.random() * fwCanvas.width; const y = Math.random() * (fwCanvas.height * 0.6);
        const colors = ['#dfba6b', '#841c1c', '#ffd700', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) particles.push(new Particle(x, y, color));
    }

    function animateFireworks() {
        if (!fwCtx || !fwCanvas) return;
        requestAnimationFrame(animateFireworks);
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        particles.forEach((p, i) => { if (p.alpha <= 0) particles.splice(i, 1); else { p.update(); p.draw(); } });
    }

    function startFireworks() { animateFireworks(); let timer = setInterval(spawnFirework, 400); setTimeout(() => clearInterval(timer), 5000); }

    // ===== GOLD PARTICLES =====
    const goldCanvas = document.getElementById("goldParticlesCanvas");
    const goldCtx = goldCanvas ? goldCanvas.getContext("2d") : null;
    let goldParticles = [];
    let animationGoldId;

    class GoldParticle {
        constructor() {
            this.x = Math.random() * window.innerWidth; this.y = Math.random() * -50;
            this.radius = Math.random() * 3 + 2; this.speedY = Math.random() * 2 + 2;
            this.speedX = (Math.random() - 0.5) * 1.5; this.opacity = Math.random() * 0.6 + 0.4;
        }
        update() { this.y += this.speedY; this.x += this.speedX; if (this.y > window.innerHeight) { this.y = -20; this.x = Math.random() * window.innerWidth; } }
        draw() {
            if (!goldCtx) return;
            goldCtx.beginPath(); goldCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            goldCtx.fillStyle = `rgba(223, 186, 107, ${this.opacity})`; goldCtx.fill();
        }
    }

    function animateGold() {
        if (!goldCtx || !goldCanvas) return;
        animationGoldId = requestAnimationFrame(animateGold);
        goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
        goldParticles.forEach(p => { p.update(); p.draw(); });
    }

    function startGoldRain() {
        if (!goldCanvas) return;
        goldCanvas.width = window.innerWidth; goldCanvas.height = window.innerHeight;
        for (let i = 0; i < 90; i++) goldParticles.push(new GoldParticle());
        animateGold();
        setTimeout(() => {
            cancelAnimationFrame(animationGoldId);
            if (goldCtx && goldCanvas) goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
            goldParticles = [];
        }, 7000);
    }

    // ===== RSVP =====
    const optYes = document.getElementById("optYes");
    const optNo = document.getElementById("optNo");
    let selectedStatus = null;

    if (optYes && optNo) {
        optYes.addEventListener("click", () => {
            optYes.classList.add("selected");
            optNo.classList.remove("selected");
            selectedStatus = "Accept";
        });
        optNo.addEventListener("click", () => {
            optNo.classList.add("selected");
            optYes.classList.remove("selected");
            selectedStatus = "Decline";
        });
    }

    // ===== FLOATING HEARTS (accept scene) =====
    function startFloatingHearts(container) {
        const hearts = ['❤️', '💕', '💖', '💗', '💝', '🩷'];
        const interval = setInterval(() => {
            if (!container || container.offsetParent === null) { clearInterval(interval); return; }
            const heart = document.createElement("div");
            heart.className = "fheart";
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = (Math.random() * 85 + 5) + "%";
            heart.style.bottom = "10%";
            heart.style.fontSize = (Math.random() * 1 + 0.8) + "rem";
            heart.style.animationDuration = (Math.random() * 2 + 2) + "s";
            heart.style.animationDelay = (Math.random() * 0.5) + "s";
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }, 350);
    }

    // ===== RAIN (decline scene) =====
    function startRain(container) {
        for (let i = 0; i < 60; i++) {
            const drop = document.createElement("div");
            drop.className = "raindrop";
            drop.style.left = (Math.random() * 100) + "%";
            const height = Math.random() * 20 + 10;
            drop.style.height = height + "px";
            drop.style.animationDuration = (Math.random() * 1 + 0.6) + "s";
            drop.style.animationDelay = (Math.random() * 2) + "s";
            drop.style.opacity = (Math.random() * 0.5 + 0.3);
            container.appendChild(drop);
        }
    }

    // ===== CONFIRM BUTTON =====
    const btnConfirm = document.getElementById("btnConfirm");
    const rsvpFormCard = document.getElementById("rsvpFormCard");
    const bunnyPageCard = document.getElementById("bunnyPageCard");

    if (btnConfirm && rsvpFormCard) {
        btnConfirm.addEventListener("click", async () => {
            const nameVal = document.getElementById("fullName").value.trim();
            const msgVal = document.getElementById("coupleMessage").value.trim();

            if (nameVal === "") {
                alert("Ju lutem shkruani Emrin dhe Mbiemrin tuaj!");
                return;
            }

            // Admin login
            if (nameVal.toLowerCase() === "admin123") {
                btnConfirm.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Duke ngarkuar...";
                btnConfirm.disabled = true;
                try {
                    const response = await fetch(DB_URL);
                    let records = [];
                    if (response.ok) { records = await response.json(); }
                    else if (response.status === 404) { records = []; }

                    rsvpFormCard.classList.add("hidden");
                    const adminPanelCard = document.getElementById("adminPanelCard");
                    const adminTableBody = document.getElementById("adminTableBody");
                    if (adminPanelCard && adminTableBody) {
                        adminPanelCard.classList.remove("hidden");
                        adminTableBody.innerHTML = records.length === 0
                            ? "<tr><td colspan='3' style='text-align:center;'>Asnjë përgjigje ende online.</td></tr>"
                            : "";
                        records.forEach(r => {
                            let badge = r.status === "Accept"
                                ? "<span class='badge-accept'>✓ Accept</span>"
                                : "<span class='badge-decline'>✗ Decline</span>";
                            adminTableBody.innerHTML += `<tr><td>${r.name}</td><td>${badge}</td><td>${r.message || '-'}</td></tr>`;
                        });
                    }
                } catch (err) {
                    alert("Gabim gjatë marrjes së të dhënave online!");
                    console.error(err);
                } finally {
                    btnConfirm.innerHTML = "<i class='fa-solid fa-paper-plane'></i> Confirm";
                    btnConfirm.disabled = false;
                }
                return;
            }

            if (!selectedStatus) {
                alert("Ju lutem zgjidhni njërën nga opsionet: Yes ose No!");
                return;
            }

            btnConfirm.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Duke dërguar...";
            btnConfirm.disabled = true;

            try {
                let currentList = [];
                const getResponse = await fetch(DB_URL);
                if (getResponse.ok) { currentList = await getResponse.json(); }
                else if (getResponse.status === 404) { currentList = []; }

                currentList.push({ name: nameVal, status: selectedStatus, message: msgVal });
                await fetch(DB_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(currentList)
                });

                rsvpFormCard.style.opacity = "0";
                rsvpFormCard.style.transition = "opacity 0.5s ease";

                setTimeout(() => {
                    rsvpFormCard.classList.add("hidden");
                    if (bunnyPageCard) {
                        bunnyPageCard.classList.remove("hidden");

                        if (selectedStatus === "Accept") {
                            // Show accept scene
                            const acceptScene = document.getElementById("acceptScene");
                            acceptScene.classList.remove("hidden");

                            const heartsContainer = document.getElementById("heartsContainer");
                            const acceptDescText = document.getElementById("acceptDescText");
                            if (acceptDescText) {
                                acceptDescText.innerHTML = `Faleminderit <strong>${nameVal}</strong>! Rezervimi yt u krye me sukses.<br>Mezi presim të festojmë së bashku në këtë ditë të bekuar! ✨`;
                            }

                            // Bunnies hug animation
                            setTimeout(() => {
                                const bl = document.getElementById("bunnyLeft");
                                const br = document.getElementById("bunnyRight");
                                if (bl) bl.classList.add("hugging");
                                if (br) br.classList.add("hugging");
                            }, 400);

                            startFloatingHearts(heartsContainer);
                            startGoldRain();

                        } else {
                            // Show decline scene
                            const declineScene = document.getElementById("declineScene");
                            declineScene.classList.remove("hidden");

                            const rainContainer = document.getElementById("rainContainer");
                            const declineDescText = document.getElementById("declineDescText");
                            if (declineDescText) {
                                declineDescText.innerHTML = `Na vjen keq që nuk do mund të jesh me ne, <strong style="color:#9ecae1">${nameVal}</strong>.<br>Por të falenderojmë përzemërsisht që na njoftove! 💙`;
                            }

                            if (rainContainer) startRain(rainContainer);

                            // Bunnies walk away
                            setTimeout(() => {
                                const bdl = document.getElementById("bunnyDeclineLeft");
                                const bdr = document.getElementById("bunnyDeclineRight");
                                if (bdl) bdl.classList.add("walking");
                                if (bdr) bdr.classList.add("walking");
                            }, 600);
                        }
                    }
                }, 500);

            } catch (error) {
                alert("Ndodhi një gabim me rrjetin. Ju lutem provoni përsëri klikimin.");
                console.error(error);
            } finally {
                btnConfirm.innerHTML = "<i class='fa-solid fa-paper-plane'></i> Confirm";
                btnConfirm.disabled = false;
            }
        });
    }
});