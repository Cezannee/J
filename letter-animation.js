export function animateLetterBody(root) {
    const paragraphs = root.querySelectorAll(".letter-body p");

    paragraphs.forEach((paragraph, paragraphIndex) => {
        const text = paragraph.dataset.letterText || paragraph.textContent;
        paragraph.dataset.letterText = text;

        paragraph.innerHTML = text
            .split("")
            .map((character) => {
                if (character === " ") {
                    return " ";
                }

                return `<span class="letter-char">${escapeHtml(character)}</span>`;
            })
            .join("");

        paragraph.querySelectorAll(".letter-char").forEach((character, characterIndex) => {
            character.animate(
                [
                    {
                        opacity: 0,
                        filter: "blur(6px)",
                        transform: "translateY(10px) rotateX(18deg)"
                    },
                    {
                        opacity: 1,
                        filter: "blur(0)",
                        transform: "translateY(0) rotateX(0)"
                    }
                ],
                {
                    delay: paragraphIndex * 180 + characterIndex * 9,
                    duration: 520,
                    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                    fill: "both"
                }
            );
        });
    });
}

export function prepareLetterBody(root) {
    root.querySelectorAll(".letter-body p").forEach((paragraph) => {
        if (!paragraph.dataset.letterText) {
            paragraph.dataset.letterText = paragraph.textContent;
        }
        paragraph.textContent = "";
    });
}

function escapeHtml(character) {
    const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return replacements[character] || character;
}
