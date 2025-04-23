"use client";

import { useEffect } from "react";
const GeometricBackground = () => {
    useEffect(() => {
        const canvas = document.getElementById("geometric-background");
        const ctx = canvas.getContext("2d");
        function resizeCanvas(){
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    // this.speedX = Math.random() * 1 - 0.5;
    // this.speedY = Math.random() * 1 - 0.5;
    this.speedX = 0;
    this.speedY = Math.random() * 5 - 0.5;
    const professionalColors = [
        'rgba(41, 71, 98, 0.4)',   
        'rgba(70, 130, 180, 0.3)',  
        'rgba(112, 128, 144, 0.3)',  
        'rgba(176, 196, 222, 0.2)'  
      ];
    this.color = professionalColors[Math.floor(Math.random() * professionalColors.length)];
    this.shape = Math.floor(Math.random() * 3);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    
    switch(this.shape) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
}

const particles = [];
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(70, 130, 180, ${0.15 - distance/1000})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}
let animationFrameId;
function animate() {
  ctx.fillStyle = 'rgba(235, 240, 255, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  
  connectParticles();
  
  animationFrameId = requestAnimationFrame(animate);
}

animate();

return () => {
    window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      };
    }, []);

return ( 
  <canvas id="geometric-background" 
  style={{
    position:'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2
  }}
  />
  );
};

export default GeometricBackground;
