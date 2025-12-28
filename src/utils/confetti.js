// Confetti animation utility
export function triggerConfetti(element) {
  const colors = ['#ff69b4', '#9d7bc9', '#ffd700', '#00ff00', '#ff6347', '#87ceeb'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    createConfettiPiece(element, colors);
  }
}

function createConfettiPiece(element, colors) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-piece';
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 10 + 5;
  const startX = element.offsetLeft + element.offsetWidth / 2;
  const startY = element.offsetTop + element.offsetHeight / 2;
  const endX = startX + (Math.random() - 0.5) * 300;
  const endY = startY - Math.random() * 200 - 100;
  const rotation = Math.random() * 720 - 360;
  const duration = Math.random() * 1 + 1;
  
  confetti.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    pointer-events: none;
    z-index: 9999;
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
  `;
  
  document.body.appendChild(confetti);
  
  // Animate
  confetti.animate([
    {
      transform: 'translate(0, 0) rotate(0deg)',
      opacity: 1,
    },
    {
      transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
      opacity: 0,
    }
  ], {
    duration: duration * 1000,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }).onfinish = () => {
    confetti.remove();
  };
}
