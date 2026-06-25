'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const CONFIG = {
  particleCount: 80,
  maxSpeed: 0.4,
  particleRadius: 1.8,
  connectionDistance: 150,
  mouseRadius: 200,
  mouseRepelForce: 0.02,
  particleColor: '37, 99, 235',
  lineColor: '37, 99, 235',
  lineOpacity: 0.14,
  particleOpacity: 0.55,
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasElement = canvas;
    const context = ctx;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = -9999;
    let mouseY = -9999;
    let animationId = 0;
    const particles: Particle[] = [];

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvasElement.width = Math.floor(width * ratio);
      canvasElement.height = Math.floor(height * ratio);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function initParticles() {
      particles.length = 0;
      const area = width * height;
      const count = Math.min(CONFIG.particleCount, Math.max(28, Math.floor(area / 12000)));

      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
          vy: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
          radius: CONFIG.particleRadius + Math.random() * 1.4,
        });
      }
    }

    function updateParticles() {
      for (const particle of particles) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.mouseRadius && distance > 0) {
          const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;
          particle.vx += (dx / distance) * force * CONFIG.mouseRepelForce;
          particle.vy += (dy / distance) * force * CONFIG.mouseRepelForce;
        }

        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > CONFIG.maxSpeed) {
          particle.vx = (particle.vx / speed) * CONFIG.maxSpeed;
          particle.vy = (particle.vy / speed) * CONFIG.maxSpeed;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -1;
        }
        if (particle.x > width) {
          particle.x = width;
          particle.vx *= -1;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -1;
        }
        if (particle.y > height) {
          particle.y = height;
          particle.vy *= -1;
        }
      }
    }

    function drawParticles() {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONFIG.connectionDistance) {
            const opacity = (1 - distance / CONFIG.connectionDistance) * CONFIG.lineOpacity;
            context.beginPath();
            context.strokeStyle = `rgba(${CONFIG.lineColor}, ${opacity})`;
            context.lineWidth = 0.8;
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }

      for (const particle of particles) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.mouseRadius) {
          const opacity = (1 - distance / CONFIG.mouseRadius) * 0.25;
          context.beginPath();
          context.strokeStyle = `rgba(${CONFIG.lineColor}, ${opacity})`;
          context.lineWidth = 0.6;
          context.moveTo(mouseX, mouseY);
          context.lineTo(particle.x, particle.y);
          context.stroke();
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${CONFIG.particleColor}, ${CONFIG.particleOpacity})`;
        context.fill();
      }
    }

    function animate() {
      updateParticles();
      drawParticles();
      animationId = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      resizeCanvas();
      initParticles();
    }

    function handleMouseMove(event: MouseEvent) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function handleMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function handleVisibility() {
      if (document.hidden) {
        window.cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
