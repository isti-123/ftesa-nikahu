document.addEventListener("DOMContentLoaded", function () {

    // Logjika e Hapjes së Perdeve me Dore
    const curtainSection = document.getElementById("curtainSection");
    const mainContent = document.getElementById("mainContent");
    const openBtn = document.getElementById("openBtn");

    openBtn.addEventListener("click", () => {
        curtainSection.classList.add("open");
        mainContent.classList.remove("hidden");
        // Inicializojmë kontrollin e scroll-it për shfaqjen e ngadaltë
        handleScrollReveal();
    });

    // Animacioni i shfaqjes së ngadaltë gjatë Scroll-it (Fade In)
    const revealElements = document.querySelectorAll(".scroll-reveal");

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.9;
        revealElements.forEach(el => {
            // Nëse countdown është akoma i fshehur, mos e aktivizo efektin e tij
            if (el.id === "page3" && el.classList.contains("hidden-countdown")) return;

            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", handleScrollReveal);

    // Krijimi i Rrathëve të Gërvishjes (Scratch Cards)
    const canvases = [
        { id: 'canvasDay', text: 'Dita' },
        { id: 'canvasMonth', text: 'Muaji' },
        { id: 'canvasYear', text: 'Viti' }
    ];
    let scratchedCount = 0;
    let completed = {};

    canvases.forEach(item => {
        const canvas = document.getElementById(item.id);
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
        countdownPage.classList.remove("hidden-countdown");
        countdownPage.classList.add("show-countdown");
        setTimeout(() => {
            countdownPage.classList.add("visible");
            handleScrollReveal();
        }, 50);
        startFireworks();
    }

    // Countdown për datën 7 Korrik 2026
    const targetDate = new Date("July 7, 2026 00:00:00").getTime();
    setInterval(function () {
        const now = new Date().getTime(); const difference = targetDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);

    // Efekti i Fishekzjarreve
    const fwCanvas = document.getElementById("fireworksCanvas"); const fwCtx = fwCanvas.getContext("2d");
    let particles = [];
    function resizeCanvas() { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color; this.radius = Math.random() * 3 + 1;
            this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 }; this.alpha = 1;
        }
        draw() { fwCtx.save(); fwCtx.globalAlpha = this.alpha; fwCtx.beginPath(); fwCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); fwCtx.fillStyle = this.color; fwCtx.fill(); fwCtx.restore(); }
        update() { this.velocity.y += 0.04; this.x += this.velocity.x; this.y += this.velocity.y; this.alpha -= 0.015; }
    }
    function spawnFirework() {
        const x = Math.random() * fwCanvas.width; const y = Math.random() * (fwCanvas.height * 0.6);
        const colors = ['#dfba6b', '#841c1c', '#ffd700', '#ffffff']; const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) particles.push(new Particle(x, y, color));
    }
    function animateFireworks() { requestAnimationFrame(animateFireworks); fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height); particles.forEach((p, i) => { if (p.alpha <= 0) particles.splice(i, 1); else { p.update(); p.draw(); } }); }
    function startFireworks() { animateFireworks(); let timer = setInterval(spawnFirework, 400); setTimeout(() => clearInterval(timer), 5000); }


    // LOGJIKA E SHTUAR: RSVP FORM & ANIMACIONI I LEPURUSHAVE & PANEL ADMINI
    const optYes = document.getElementById("optYes");
    const optNo = document.getElementById("optNo");
    let selectedStatus = null;

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

    // Grimcat e Arit për "Accept"
    const goldCanvas = document.getElementById("goldParticlesCanvas");
    const goldCtx = goldCanvas.getContext("2d");
    let goldParticles = [];
    let animationGoldId;

    class GoldParticle {
        constructor() {
            this.x = Math.random() * window.innerWidth; this.y = Math.random() * -50;
            this.radius = Math.random() * 3 + 2; this.speedY = Math.random() * 2 + 2;
            this.speedX = (Math.random() - 0.5) * 1.5; this.opacity = Math.random() * 0.6 + 0.4;
        }
        update() { this.y += this.speedY; this.x += this.speedX; if (this.y > window.innerHeight) { this.y = -20; this.x = Math.random() * window.innerWidth; } }
        draw() { goldCtx.beginPath(); goldCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); goldCtx.fillStyle = `rgba(223, 186, 107, ${this.opacity})`; goldCtx.fill(); }
    }

    function animateGold() {
        animationGoldId = requestAnimationFrame(animateGold);
        goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
        goldParticles.forEach(p => { p.update(); p.draw(); });
    }

    function startGoldRain() {
        goldCanvas.width = window.innerWidth; goldCanvas.height = window.innerHeight;
        for (let i = 0; i < 90; i++) goldParticles.push(new GoldParticle());
        animateGold();
        setTimeout(() => { cancelAnimationFrame(animationGoldId); goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height); goldParticles = []; }, 7000);
    }

    // Efekti i zemrave që fluturojnë tek lepurushët
    function startHeartFloater(container) {
        setInterval(() => {
            if (container.offsetParent === null) return; // Ndalo nëse nuk është aktive dritarja
            const heart = document.createElement("div");
            heart.innerHTML = "❤️"; heart.className = "floating-heart";
            heart.style.left = (Math.random() * 60 + 20) + "px";
            heart.style.top = (Math.random() * 30 + 10) + "px";
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, 400);
    }

    // Dërgimi i të dhënave në Google Sheet lokal dhe në memorie (për Adminin)
    function saveRsvpData(name, status, msg) {
        // Ruajmë lokalisht në laptop për panelin tënd të adminit
        let currentList = JSON.parse(localStorage.getItem("rsvpRecords")) || [];
        currentList.push({ name: name, status: status, message: msg });
        localStorage.setItem("rsvpRecords", JSON.stringify(currentList));

        // URL e Google Apps Script që krijove te hapi i kaluar
        const webAppUrl = "KËTU_VENDOSET_LINKU_I_GOOGLE_SCRIPT";
        if (webAppUrl !== "KËTU_VENDOSET_LINKU_I_GOOGLE_SCRIPT") {
            fetch(webAppUrl, {
                method: "POST", mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name, response: status + " - " + msg })
            });
        }
    }

    // Butoni i madh CONFIRM
    const btnConfirm = document.getElementById("btnConfirm");
    const rsvpFormCard = document.getElementById("rsvpFormCard");
    const bunnyPageCard = document.getElementById("bunnyPageCard");
    const bunnyGraphics = document.getElementById("bunnyGraphics");
    const bunnyStatusTitle = document.getElementById("bunnyStatusTitle");
    const bunnyStatusDesc = document.getElementById("bunnyStatusDesc");

    btnConfirm.addEventListener("click", () => {
        const nameVal = document.getElementById("fullName").value.trim();
        const msgVal = document.getElementById("coupleMessage").value.trim();

        if (nameVal === "") {
            alert("Ju lutem shkruani Emrin dhe Mbiemrin tuaj!");
            return;
        }

        // HAKU I ADMINIT SEKRET: Nëse ti shkruan kodin 'admin123' hapet paneli yt
        if (nameVal.toLowerCase() === "admin123") {
            rsvpFormCard.classList.add("hidden");
            const adminPanelCard = document.getElementById("adminPanelCard");
            const adminTableBody = document.getElementById("adminTableBody");
            adminPanelCard.classList.remove("hidden");

            let records = JSON.parse(localStorage.getItem("rsvpRecords")) || [];
            adminTableBody.innerHTML = records.length === 0 ? "<tr><td colspan='3' style='text-align:center;'>Asnjë përgjigje ende.</td></tr>" : "";

            records.forEach(r => {
                let badge = r.status === "Accept" ? "<span class='badge-accept'>Accept</span>" : "<span class='badge-decline'>Decline</span>";
                adminTableBody.innerHTML += `<tr><td>${r.name}</td><td>${badge}</td><td>${r.message || '-'}</td></tr>`;
            });
            return;
        }

        if (!selectedStatus) {
            alert("Ju lutem zgjidhni njërën nga opsionet: Yes ose No!");
            return;
        }

        // Zhduk formularin dhe shfaq faqen interaktive me Lepurusha
        rsvpFormCard.style.opacity = "0";
        rsvpFormCard.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            rsvpFormCard.classList.add("hidden");
            bunnyPageCard.classList.remove("hidden");

            if (selectedStatus === "Accept") {
                bunnyPageCard.classList.add("accept-bg");
                bunnyGraphics.innerHTML = "𓃹💖𓃺"; // Dy lepurushë duke u përqafuar
                bunnyStatusTitle.innerHTML = "Yes, I'll be there!";
                bunnyStatusDesc.innerHTML = `Faleminderit <strong>${nameVal}</strong>! Rezervimi yt u krye me sukses. Mezi presim të festojmë së bashku në këtë ditë të bekuar! ✨`;
                startGoldRain();
                startHeartFloater(bunnyGraphics);
            } else {
                bunnyPageCard.classList.add("decline-bg");
                bunnyGraphics.innerHTML = "𓃹💔𓃺"; // Dy lepurushë të mërzitur me zemër të thyer
                bunnyStatusTitle.innerHTML = "No, I can't make it";
                bunnyStatusDesc.innerHTML = `Na vjen keq që nuk do mund të jesh me ne <strong>${nameVal}</strong>, por të falenderojmë përzemërsisht që na njoftove!`;
            }

            // Ruajmë të dhënat
            saveRsvpData(nameVal, selectedStatus, msgVal);
        }, 500);
    });
});