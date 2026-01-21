'use client';

import { useEffect, useRef } from 'react';
import styles from './CodeRain.module.css';

const CODE_TERMS = [
  'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
  'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'throw',
  'new', 'this', 'super', 'extends', 'static', 'public', 'private',
  'interface', 'type', 'enum', 'null', 'undefined', 'true', 'false',
  'console.log', 'useState', 'useEffect', 'render', 'props', 'state',
  'npm', 'git', 'push', 'pull', 'commit', 'merge', 'branch', 'deploy',
  'API', 'REST', 'JSON', 'HTTP', 'GET', 'POST', 'PUT', 'DELETE',
  'React', 'Node', 'Python', 'Java', 'SQL', 'MongoDB', 'Docker', 'AWS',
  '{}', '[]', '=>', '===', '!==', '&&', '||', '++', '--', '+=',
  '<div>', '</>', 'map()', 'filter()', 'reduce()', 'forEach()',
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INSERT', 'UPDATE', 'DELETE',
  'def', 'print', 'lambda', 'self', 'init', '__main__',
  'sudo', 'chmod', 'mkdir', 'cd', 'ls', 'grep', 'curl', 'ssh'
];

export default function CodeRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / (fontSize * 4));
    const drops = Array(columns).fill(1);
    const terms = Array(columns).fill('').map(() =>
      CODE_TERMS[Math.floor(Math.random() * CODE_TERMS.length)]
    );

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = terms[i];
        const x = i * fontSize * 4;
        const y = drops[i] * fontSize;

        const gradient = ctx.createLinearGradient(x, y - fontSize * 3, x, y);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
        gradient.addColorStop(0.8, 'rgba(0, 255, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0.7)');
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          terms[i] = CODE_TERMS[Math.floor(Math.random() * CODE_TERMS.length)];
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.codeRain} />;
}
