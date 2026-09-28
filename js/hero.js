const hero = document.getElementById("hero");
const heroContent = document.querySelector(".hero-content");
const heroGrid = document.querySelector(".hero-grid");
const telemetry = document.querySelector(".hero-telemetry");
const heroCar = document.querySelector(".drag-car");
const exploreButton = document.querySelector(".primary-button");

exploreButton.addEventListener("click", () => {
    window.location.href = "explore.html";
});

if (hero) {
    hero.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (heroContent) {
            heroContent.style.transform =
                `translate(${x * -8}px, ${y * -5}px)`;
        }

        if (telemetry) {
            telemetry.style.transform =
                `translate(${x * 5}px, ${y * 3}px)`;
        }

        if (heroGrid) {
            heroGrid.style.transform =
                `perspective(500px) rotateX(60deg) scale(1.5) translate(${x * 8}px, ${y * 5}px)`;
        }
    });

    hero.addEventListener("mouseleave", () => {
        if (heroContent) {
            heroContent.style.transform = "translate(0, 0)";
        }

        if (telemetry) {
            telemetry.style.transform = "translate(0, 0)";
        }

        if (heroGrid) {
            heroGrid.style.transform =
                "perspective(500px) rotateX(60deg) scale(1.5)";
        }
    });
}

if (heroCar) {
    heroCar.addEventListener("animationend", () => {
        if (heroCar.classList.contains("hero-engine-start")) {
            heroCar.classList.remove("hero-engine-start");
        }
    });
}