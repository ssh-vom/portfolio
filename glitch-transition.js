document.addEventListener("DOMContentLoaded", () => {
    // Select all internal links you'd like to glitch-out on click
    // For example: all <a> that link to your own site or .html files
    const internalLinks = document.querySelectorAll(
      'a[href^="/"], a[href^="./"], a[href^="../"], a[href$=".html"]'
    );

    internalLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        // 1) Avoid glitching if the href is just an #anchor on this page
        if (link.getAttribute('href').startsWith('#')) {
          return; // do nothing, let it jump
        }

        // 2) Prevent normal navigation
        event.preventDefault();

        // 3) Add the "glitch-out" class to body
        document.body.classList.add("glitch-out");

        // 4) After the animation finishes, finally navigate
        setTimeout(() => {
          window.location = link.href;
        }, 600); // match the .6s in your CSS
      });
    });
  });

