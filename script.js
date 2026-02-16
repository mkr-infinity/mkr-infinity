// Particle Network
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.color = '255, 255, 255';
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        this.resize();
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = (this.canvas.width * this.canvas.height) / 15000;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    setColor(hslString) {
        // Convert HSL to RGB approximately for particles
        const h = parseInt(hslString.split(',')[0]);
        this.color = h > 0 ? `hsla(${hslString}, 0.5)` : 'rgba(255, 255, 255, 0.5)';
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            
            // Lines
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.color.replace('0.5', (1 - dist / 150) * 0.2);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Custom Cursor
function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.transform = `translate3d(${cursorX - 8}px, ${cursorY - 8}px, 0)`;
        cursorGlow.style.transform = `translate3d(${cursorX - 64}px, ${cursorY - 64}px, 0)`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    document.querySelectorAll('a, button, .cursor-pointer').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(2.5)';
            cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.backgroundColor = 'white';
        });
    });
}

// GitHub Projects Fetcher
async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    const skipRepos = ['kaif', 'sonu', 'period-calculator'];
    try {
        const res = await fetch('https://api.github.com/users/mkr-infinity/repos?sort=updated&per_page=20');
        const repos = await res.json();
        
        grid.innerHTML = '';
        const filteredRepos = repos.filter(repo => !skipRepos.includes(repo.name.toLowerCase())).slice(0, 6);
        
        filteredRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group cursor-pointer';
            card.innerHTML = `
                <div class="project-content relative z-10">
                    <div class="flex justify-between items-start mb-4">
                        <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                        <div class="flex items-center gap-2 text-xs font-mono opacity-50">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>${repo.language || 'Code'}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">${repo.name}</h3>
                    <p class="text-sm text-gray-400 line-clamp-2 mb-6">${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" target="_blank" class="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                        View Source <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            `;
            grid.appendChild(card);
            initTilt(card);
        });
    } catch (e) {
        console.error('Failed to fetch repos', e);
        grid.innerHTML = '<p class="text-gray-500 col-span-full">Failed to load repositories. Please check back later.</p>';
    }
}

// 3D Tilt Effect
function initTilt(el) {
    if (window.innerWidth < 768) return;
    
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

// Theme Observer
function initThemeObserver(particles) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.dataset.theme;
                const themeColor = getComputedStyle(entry.target).getPropertyValue('--theme-color');
                
                // Update brand aura
                const brandAura = document.getElementById('brand-aura');
                brandAura.style.backgroundColor = `hsla(${themeColor}, 0.5)`;
                
                // Update aurora background
                const aurora = document.getElementById('aurora');
                aurora.style.backgroundColor = `hsla(${themeColor}, 0.15)`;
                
                // Update particles
                particles.setColor(themeColor);
                
                // Update button glow colors
                document.documentElement.style.setProperty('--btn-glow', `hsla(${themeColor}, 0.3)`);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-theme').forEach(section => observer.observe(section));
}

// Copy Wallet
function initWalletCopy() {
    document.querySelectorAll('.wallet-card').forEach(card => {
        card.addEventListener('click', () => {
            const address = card.dataset.address;
            navigator.clipboard.writeText(address);
            
            const toast = document.getElementById('toast');
            toast.style.transform = 'translate(-50%, 0)';
            toast.style.opacity = '1';
            
            setTimeout(() => {
                toast.style.transform = 'translate(-50%, 20px)';
                toast.style.opacity = '0';
            }, 3000);
        });
    });
}

// Skills Injection
function initSkills() {
    const skills = [
        { name: 'Solidity', icon: '💎', color: 'blue' },
        { name: 'React', icon: '⚛️', color: 'cyan' },
        { name: 'Python', icon: '🐍', color: 'yellow' },
        { name: 'Ethers.js', icon: '⚡', color: 'yellow' },
        { name: 'Tailwind', icon: '🎨', color: 'blue' },
        { name: 'Web3.js', icon: '🌐', color: 'orange' }
    ];
    
    const grid = document.getElementById('skills-grid');
    skills.forEach((skill, i) => {
        const div = document.createElement('div');
        div.className = 'glass p-8 rounded-2xl border border-white/10 animate-float h-full flex flex-col items-center justify-center gap-4 group hover:border-purple-500/30 transition-all';
        div.style.animationDelay = `${i * 0.2}s`;
        div.innerHTML = `
            <span class="text-4xl group-hover:scale-125 transition-transform">${skill.icon}</span>
            <span class="font-bold tracking-tight">${skill.name}</span>
        `;
        grid.appendChild(div);
    });
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

// Main Init
document.addEventListener('DOMContentLoaded', () => {
    const particles = new ParticleNetwork();
    initCursor();
    fetchProjects();
    initThemeObserver(particles);
    initWalletCopy();
    initSkills();
    initMobileMenu();
    
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    const sun = document.getElementById('sun-icon');
    const moon = document.getElementById('moon-icon');
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light');
        sun.classList.toggle('hidden');
        moon.classList.toggle('hidden');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
    }
});
