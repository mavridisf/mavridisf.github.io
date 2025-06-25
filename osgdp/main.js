/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

window.on("load", () => {
  // --- Scroll reveal animation ----------------------------------------------
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        entry.target.classList.toggle("visible", entry.isIntersecting);

        // Location hash update
        if (entry.isIntersecting) {
          window.location.href = '#' + entry.target.id;
        }
      })
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.5
    }
  );

  $("section").forEach(section => observer.observe(section));

  // --- Spoilers -------------------------------------------------------------
  $(".spoiler").forEach(spoiler => {
    spoiler.attribute("data-reveal", spoiler.innerHTML);
    spoiler.innerHTML = $$("span", "…", {'classList': 'reveal'}).outerHTML;
    spoiler.on("click", () => {
      spoiler.innerHTML = spoiler.attribute("data-reveal")
    });
  });
});

// kate: replace-tabs true; indent-width 2;