const statNumbers = document.querySelectorAll(".performance-stat strong");
const performanceSection = document.getElementById("performance");

let performanceStarted = false;

function animateNumber(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - start) / duration, 1);
        const value = target * progress;

        if (target % 1 !== 0) {
            element.textContent = value.toFixed(1);
        } else {
            element.textContent = Math.floor(value);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function startPerformanceAnimation() {
    if (performanceStarted) {
        return;
    }

    performanceStarted = true;

    statNumbers.forEach((number) => {
        animateNumber(number);
    });
}

const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            startPerformanceAnimation();
        }
    });
}, {
    threshold: 0.3
});

performanceObserver.observe(performanceSection);