const loadingScreen = document.getElementById("loading-screen");
const loadingNumber = document.getElementById("loading-number");
const loadingProgress = document.getElementById("loading-progress");
const systemReady = document.getElementById("system-ready");
const enterSite = document.getElementById("enter-site");

let loadingValue = 0;

function startLoading() {
    const interval = setInterval(() => {
        loadingValue++;

        loadingNumber.textContent =
            String(loadingValue).padStart(2, "0");

        loadingProgress.style.width =
            `${loadingValue}%`;

        if (loadingValue >= 100) {
            clearInterval(interval);

            systemReady.style.opacity = "1";
            systemReady.style.transform = "translateY(0)";

            enterSite.style.opacity = "1";
            enterSite.style.transform = "translateY(0)";
            enterSite.style.pointerEvents = "auto";
        }
    }, 25);
}

enterSite.addEventListener("click", () => {
    loadingScreen.classList.add("hide");

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 1000);
});

startLoading();