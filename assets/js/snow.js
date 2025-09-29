document.addEventListener("DOMContentLoaded", function() {
  const body = document.body;
  const snowflakeCount = 50; // Número de flocos de neve

  for (let i = 0; i < snowflakeCount; i++) {
    let snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "❄";

    // Posiciona o floco de neve horizontalmente de forma aleatória
    snowflake.style.left = Math.random() * window.innerWidth + "px";

    // Define durações de animação e tamanhos de fonte aleatórios para um efeito mais natural
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + "s"; // Duração entre 5 e 10 segundos
    snowflake.style.fontSize = (Math.random() * 10 + 10) + "px"; // Tamanho entre 10px e 20px
    snowflake.style.animationDelay = Math.random() * 5 + "s"; // Atraso para que não comecem todos juntos

    body.appendChild(snowflake);
  }
});