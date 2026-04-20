window.addEventListener("scroll", () => {
  document.querySelectorAll(".card").forEach(card => {
    let position = card.getBoundingClientRect().top;
    let screenHeight = window.innerHeight;

    if(position < screenHeight - 100){
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});
const text = "Muhammad Naseeb";
let i = 0;

function typingEffect() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML = text.substring(0, i + 1);
    i++;
    setTimeout(typingEffect, 100);
  }
}

document.getElementById("typing").innerHTML = "";
typingEffect();