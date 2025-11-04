
// typing effect with moving cursor
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".typewriter");

  elements.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = ""; // clear
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    el.appendChild(cursor);

    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(type, 80); // speed in ms
      } else {
        cursor.classList.add("blink"); // blink when done
      }
    };
    type();
  });
});



document.addEventListener("DOMContentLoaded", () => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll("#top-nav a");

    links.forEach(link => {
      const href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
