document.addEventListener("DOMContentLoaded", function () {

    const rpmValue = document.getElementById("rpm-value");
    const rpmProgress = document.getElementById("rpm-progress");
    const speedValue = document.getElementById("speed-value");
    const gearValue = document.getElementById("gear-value");
    const temperatureValue = document.getElementById("temperature-value");
    const launchStatus = document.getElementById("launch-status");

    const heroRpm = document.getElementById("hero-rpm");
    const heroSpeed = document.getElementById("hero-speed");
    const heroGear = document.getElementById("hero-gear");
    const heroPower = document.getElementById("hero-power");

    const engineButton = document.getElementById("engine-button");
    const heroCar = document.querySelector(".drag-car");
    const gearKeys = document.querySelectorAll(".gear-keys div");

    const hero = document.getElementById("hero");
    const roadLines = document.querySelector(".road-lines");
    const speedStreaks = document.querySelector(".speed-streaks");

    if (!engineButton) {
        return;
    }

    let engineRunning = false;
    let currentGear = 0;
    let currentRpm = 900;
    let currentSpeed = 0;
    let currentTemperature = 72;
    let animationFrame = null;

    const gearData = {
        0: {
            maxSpeed: 0,
            maxRpm: 900
        },
        1: {
            maxSpeed: 80,
            maxRpm: 9000
        },
        2: {
            maxSpeed: 130,
            maxRpm: 9000
        },
        3: {
            maxSpeed: 190,
            maxRpm: 9000
        },
        4: {
            maxSpeed: 250,
            maxRpm: 9000
        },
        5: {
            maxSpeed: 310,
            maxRpm: 9000
        },
        6: {
            maxSpeed: 340,
            maxRpm: 9000
        }
    };

    function updateGear(gear) {

        if (!engineRunning) {
            return;
        }

        currentGear = gear;

        if (gearValue) {
            gearValue.textContent =
                gear === 0 ? "N" : String(gear);
        }

        if (heroGear) {
            heroGear.textContent =
                gear === 0 ? "N" : String(gear);
        }

        gearKeys.forEach(function (key) {

            key.classList.remove("active");

            const keyValue = key.textContent.trim();

            if (
                (gear === 0 && keyValue === "N") ||
                (gear > 0 && keyValue === String(gear))
            ) {
                key.classList.add("active");
            }
        });

        if (launchStatus) {
            launchStatus.textContent =
                gear === 0 ? "NEUTRAL" : "RUNNING";
        }
    }

    function updateDisplay() {

        if (rpmValue) {
            rpmValue.textContent =
                String(Math.floor(currentRpm)).padStart(4, "0");
        }

        if (rpmProgress) {
            rpmProgress.style.width =
                `${Math.min((currentRpm / 9000) * 100, 100)}%`;
        }

        if (speedValue) {
            speedValue.textContent =
                String(Math.floor(currentSpeed)).padStart(3, "0");
        }

        if (gearValue) {
            gearValue.textContent =
                currentGear === 0 ? "N" : String(currentGear);
        }

        if (temperatureValue) {
            temperatureValue.textContent =
                String(Math.floor(currentTemperature));
        }

        if (heroRpm) {
            heroRpm.textContent =
                String(Math.floor(currentRpm)).padStart(4, "0");
        }

        if (heroSpeed) {
            heroSpeed.textContent =
                String(Math.floor(currentSpeed)).padStart(3, "0");
        }

        if (heroGear) {
            heroGear.textContent =
                currentGear === 0 ? "N" : String(currentGear);
        }

        if (heroPower) {
            heroPower.textContent =
                String(
                    Math.floor(
                        300 +
                        currentGear * 100 +
                        (currentRpm / 9000) * 300
                    )
                );
        }
    }

    function updateTelemetry() {

        if (!engineRunning) {
            return;
        }

        const data = gearData[currentGear];

        if (currentGear === 0) {

            currentRpm +=
                (900 - currentRpm) * 0.08;

            currentSpeed *= 0.98;

            if (heroCar) {
                heroCar.classList.remove("driving");
                heroCar.style.marginLeft = "0px";
            }

            if (hero) {
                hero.classList.remove("engine-running");
            }

            if (roadLines) {
                roadLines.style.animationDuration = "0.8s";
            }

            if (speedStreaks) {
                speedStreaks.style.opacity = "0";
            }

        } else {

            const targetRpm =
                2200 +
                (currentSpeed / data.maxSpeed) * 6000;

            currentRpm +=
                (targetRpm - currentRpm) * 0.06;

            const acceleration =
                currentGear * 0.025;

            currentSpeed += acceleration;

            if (currentSpeed > data.maxSpeed) {
                currentSpeed = data.maxSpeed;
            }

            if (currentRpm >= 8200) {

                if (launchStatus) {
                    launchStatus.textContent = "SHIFT";
                }

            } else {

                if (launchStatus) {
                    launchStatus.textContent = "RUNNING";
                }
            }

            if (heroCar) {

                heroCar.classList.add("driving");

                const movement =
                    currentSpeed * 0.02;

                heroCar.style.marginLeft =
                    `${movement}px`;
            }

            if (hero) {
                hero.classList.add("engine-running");
            }

            if (roadLines) {

                const roadSpeed =
                    Math.max(
                        0.08,
                        0.8 - currentSpeed / 500
                    );

                roadLines.style.animationDuration =
                    `${roadSpeed}s`;
            }

            if (speedStreaks) {

                const speedEffect =
                    Math.min(currentSpeed / 340, 1);

                speedStreaks.style.opacity =
                    String(speedEffect * 0.8);
            }
        }

        currentTemperature +=
            currentGear > 0 ? 0.002 : -0.01;

        currentTemperature =
            Math.max(
                72,
                Math.min(currentTemperature, 105)
            );

        updateDisplay();

        animationFrame =
            requestAnimationFrame(updateTelemetry);
    }

    function startEngine() {

        if (engineRunning) {
            return;
        }

        engineRunning = true;

        currentGear = 0;
        currentRpm = 900;
        currentSpeed = 0;
        currentTemperature = 72;

        engineButton.textContent = "STOP ENGINE";
        engineButton.classList.add("engine-active");

        if (hero) {
            hero.classList.add("engine-running");
        }

        if (heroCar) {

            heroCar.classList.add("hero-engine-start");

            setTimeout(function () {

                if (heroCar) {
                    heroCar.classList.remove(
                        "hero-engine-start"
                    );
                }

            }, 1500);
        }

        updateGear(0);
        updateDisplay();

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        updateTelemetry();
    }

    function stopEngine() {

        engineRunning = false;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        currentGear = 0;
        currentRpm = 900;
        currentSpeed = 0;
        currentTemperature = 72;

        engineButton.textContent = "START ENGINE";
        engineButton.classList.remove("engine-active");

        if (hero) {
            hero.classList.remove("engine-running");
        }

        if (heroCar) {

            heroCar.classList.remove("driving");
            heroCar.classList.remove("hero-engine-start");
            heroCar.style.marginLeft = "0px";
        }

        if (roadLines) {
            roadLines.style.animationDuration = "0.8s";
        }

        if (speedStreaks) {
            speedStreaks.style.opacity = "0";
        }

        if (rpmValue) {
            rpmValue.textContent = "0900";
        }

        if (rpmProgress) {
            rpmProgress.style.width = "0%";
        }

        if (speedValue) {
            speedValue.textContent = "000";
        }

        if (gearValue) {
            gearValue.textContent = "N";
        }

        if (temperatureValue) {
            temperatureValue.textContent = "72";
        }

        if (launchStatus) {
            launchStatus.textContent = "READY";
        }

        if (heroRpm) {
            heroRpm.textContent = "0900";
        }

        if (heroSpeed) {
            heroSpeed.textContent = "000";
        }

        if (heroGear) {
            heroGear.textContent = "N";
        }

        if (heroPower) {
            heroPower.textContent = "900";
        }

        gearKeys.forEach(function (key) {
            key.classList.remove("active");
        });
    }

    engineButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (engineRunning) {
            stopEngine();
        } else {
            startEngine();
        }
    });

    gearKeys.forEach(function (key) {

        key.addEventListener("click", function () {

            if (!engineRunning) {
                return;
            }

            const value =
                key.textContent.trim();

            if (value === "N") {
                updateGear(0);
            } else if (
                value >= "1" &&
                value <= "6"
            ) {
                updateGear(Number(value));
            }
        });
    });

    document.addEventListener("keydown", function (event) {

        if (!engineRunning) {
            return;
        }

        if (
            event.key >= "1" &&
            event.key <= "6"
        ) {
            updateGear(Number(event.key));
        }

        if (
            event.key.toLowerCase() === "n"
        ) {
            updateGear(0);
        }
    });

    updateDisplay();

});