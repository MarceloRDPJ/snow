document.addEventListener("DOMContentLoaded", () => {
  const snowContainer = document.getElementById("snow-container");

  if (!snowContainer) {
    console.error("Snow container not found!");
    return;
  }

  function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");

    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10 seconds
    snowflake.style.opacity = Math.random();
    snowflake.style.width = `${Math.random() * 5 + 2}px`;
    snowflake.style.height = snowflake.style.width;

    snowContainer.appendChild(snowflake);

    // Remove snowflake after it falls
    snowflake.addEventListener("animationend", () => {
      snowflake.remove();
    });
  }

  setInterval(createSnowflake, 100); // Create a new snowflake every 100ms
});