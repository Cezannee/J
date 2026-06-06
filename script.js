// --- LOGIC 1: Countdown Timer Logic ---
// Set your girlfriend's birthday date here (Format: YYYY-MM-DDTHH:MM:SS)
const birthdayDate = new Date("2026-06-07T00:00:00").getTime();
let hasCountdownCompleted = false;

const countdownFunction = setInterval(function() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const currentTimeStatus = document.getElementById("current-time-status");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        clearInterval(countdownFunction);
        return;
    }

    const now = new Date().getTime();
    const distance = birthdayDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const remainingSeconds = Math.max(0, Math.ceil(distance / 1000));

    daysElement.innerText = days < 10 ? "0" + days : days;
    hoursElement.innerText = hours < 10 ? "0" + hours : hours;
    minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
    secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;

    if (currentTimeStatus) {
        currentTimeStatus.innerText = remainingSeconds.toString();
    }

    if (distance < 0) {
        clearInterval(countdownFunction);
        daysElement.innerText = "00";
        hoursElement.innerText = "00";
        minutesElement.innerText = "00";
        secondsElement.innerText = "00";
        completeCountdown();
    }
}, 1000);

document.querySelectorAll(".scramble-text").forEach((element, index) => {
    runScrambleText(element, index * 380);
});

function runScrambleText(element, delay = 0) {
    const finalText = element.textContent.trim();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*+?@";
    const duration = 2800;
    const frameRate = 44;
    const totalFrames = Math.ceil(duration / frameRate);

    element.dataset.text = finalText;
    element.classList.add("is-scrambling");

    setTimeout(() => {
        let frame = 0;
        const timer = setInterval(() => {
            const progress = frame / totalFrames;
            const revealedCount = Math.floor(progress * finalText.length);

            element.innerHTML = finalText
                .split("")
                .map((character, characterIndex) => {
                    if (character === " ") {
                        return "&nbsp;";
                    }

                    if (characterIndex < revealedCount) {
                        return character;
                    }

                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            frame += 1;

            if (frame > totalFrames) {
                clearInterval(timer);
                element.textContent = finalText;
                element.classList.remove("is-scrambling");
            }
        }, frameRate);
    }, delay);
}

function completeCountdown() {
    if (hasCountdownCompleted) {
        return;
    }

    hasCountdownCompleted = true;

    const countdownSection = document.querySelector(".section-countdown");
    const completeMessage = document.getElementById("countdown-complete");
    const completeStatus = document.getElementById("complete-status");
    const currentTimeStatus = document.getElementById("current-time-status");

    countdownSection?.classList.add("countdown-finished");
    completeMessage?.classList.add("show");
    if (completeStatus) {
        completeStatus.innerText = "true";
    }
    if (currentTimeStatus) {
        currentTimeStatus.innerText = "0";
    }
    triggerHeartsEffect();

    if (completeMessage) {
        runScrambleText(completeMessage.querySelector("h3"), 240);
    }

    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: "birthday:countdown-complete"
        }, "*");
    }

    try {
        localStorage.setItem("countdownCompleted", "true");
        window.dispatchEvent(new CustomEvent('countdown:complete'));
    } catch (e) {
        // ignore localStorage errors in private modes
    }
}


// --- LOGIC 2: Page Opening / Closing Animation ---
document.body.classList.add("page-entering");

setTimeout(() => {
    document.body.classList.remove("page-entering");
}, 760);

const pageNextButtons = document.querySelectorAll(".page-next");
const pagePrevButtons = document.querySelectorAll(".page-prev");

function navigateToPage(pageUrl) {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: "birthday:navigate",
            href: pageUrl
        }, "*");
        return;
    }

    window.location.href = "index.html?page=" + encodeURIComponent(pageUrl);
}

pageNextButtons.forEach((button) => {
    button.addEventListener("click", function(event) {
        const nextPage = button.getAttribute("data-next");
        const currentPage = document.querySelector(".book-page");

        if (!nextPage || !currentPage) {
            return;
        }

        // If this is the countdown page, prevent navigation until countdown completes
        const isCountdownPage = document.getElementById('countdown') !== null;
        const countdownDone = hasCountdownCompleted || localStorage.getItem('countdownCompleted') === 'true';

        if (isCountdownPage && !countdownDone) {
            // show a friendly notification and do not navigate
            showNotification("Tunggu sampai pada waktunya ya hehe /ᐠ ¬`‸´¬ マ");
            triggerLoveBubbles(event.clientX, event.clientY);
            return;
        }

        button.disabled = true;
        triggerLoveBubbles(event.clientX, event.clientY);
        currentPage.classList.remove("page-turning");
        void currentPage.offsetWidth;
        currentPage.classList.add("page-turning");

        setTimeout(() => {
            navigateToPage(nextPage);
        }, 780);
    });
});


// Small toast notification utility
function showNotification(message, duration = 3500) {
    if (!message) return;

    // prevent multiple toasts stacking
    const existing = document.querySelector('.site-toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // auto-remove
    setTimeout(() => {
        toast.classList.add('site-toast--hide');
        setTimeout(() => toast.remove(), 380);
    }, duration);
}

pagePrevButtons.forEach((button) => {
    button.addEventListener("click", function(event) {
        const prevPage = button.getAttribute("data-prev");
        const currentPage = document.querySelector(".book-page");

        if (!prevPage || !currentPage) {
            return;
        }

        button.disabled = true;
        triggerLoveBubbles(event.clientX, event.clientY);
        currentPage.classList.remove("page-turning-back");
        void currentPage.offsetWidth;
        currentPage.classList.add("page-turning-back");

        setTimeout(() => {
            navigateToPage(prevPage);
        }, 780);
    });
});


// --- LOGIC 3: Interactive Letter Unlocker & Particle Trigger ---
const btnUnlock = document.getElementById("btn-unlock");
const secretLetter = document.getElementById("secret-letter");

function prepareSecretLetterBody() {
    if (secretLetter && typeof window.prepareLetterBody === "function") {
        window.prepareLetterBody(secretLetter);
    }
}

window.addEventListener("letter-animation-ready", prepareSecretLetterBody);
setTimeout(prepareSecretLetterBody, 0);

if (btnUnlock && secretLetter) {
    btnUnlock.addEventListener("click", function() {
        if (secretLetter.classList.contains("hidden")) {
            secretLetter.classList.remove("hidden");

            setTimeout(() => {
                secretLetter.classList.add("show");
                if (typeof window.animateLetterBody === "function") {
                    setTimeout(() => {
                        window.animateLetterBody(secretLetter);
                    }, 2000);
                }
            }, 50);

            btnUnlock.innerText = "Close Love Letter";
            triggerHeartsEffect();
        } else {
            secretLetter.classList.remove("show");
            btnUnlock.innerText = "Open Love Letter";

            setTimeout(() => {
                secretLetter.classList.add("hidden");
            }, 600);
        }
    });
}


// --- LOGIC 4: Floating Romantic Particle Generation ---
function triggerHeartsEffect() {
    const container = document.getElementById("particle-container");

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart-particle");

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDelay = Math.random() * 2 + "s";

        const scale = Math.random() * 1.5 + 0.5;
        heart.style.transform = `rotate(45deg) scale(${scale})`;

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}

function triggerLoveBubbles(x, y) {
    const container = document.getElementById("particle-container");

    for (let i = 0; i < 18; i++) {
        const bubble = document.createElement("span");
        bubble.classList.add("love-bubble");

        const driftX = (Math.random() - 0.5) * 150;
        const driftY = -Math.random() * 150 - 40;
        const size = Math.random() * 16 + 14;

        bubble.style.left = x + "px";
        bubble.style.top = y + "px";
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.setProperty("--bubble-x", driftX + "px");
        bubble.style.setProperty("--bubble-y", driftY + "px");
        bubble.style.animationDelay = Math.random() * 0.12 + "s";

        container.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 1600);
    }
}
