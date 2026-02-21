// Particle Network
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.color = '255, 0, 0';
        
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
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        if (!this.canvas) return;
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
        this.color = `hsla(${hslString}, 0.5)`;
    }

    animate() {
        if (!this.canvas) return;
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
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.color.replace('0.5', (1 - dist / 150) * 0.1);
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

// Typing Effect
function initTypingEffect() {
    const text = document.getElementById('typing-skill');
    if (!text) return;
    const skills = [
        "Python Developer",
        "Asset Manager",
        "Tech Enthusiast",
        "Professional Branding",
        "Channel Specialist",
        "Community Manager",
        "Profile Optimizer"
        "Asset Manager",
        "Telegram Channel Management",
        "Community Growth Strategy"
    ];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentSkill = skills[skillIndex];
        
        if (isDeleting) {
            text.textContent = currentSkill.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            text.textContent = currentSkill.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentSkill.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    
    type();
}


// GitHub Projects Fetcher
async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const skipRepos = ['kaif', 'sonu', 'period-calculator', 'ashvin', 'image-generator'];
    try {
        const res = await fetch('https://api.github.com/users/mkr-infinity/repos?sort=updated&per_page=20');
        const repos = await res.json();
        
        grid.innerHTML = '';
        const reposArray = Array.isArray(repos) ? repos : [];
        
        const filteredRepos = reposArray
            .filter(repo => !skipRepos.includes(repo.name.toLowerCase()))
            .sort((a, b) => {
                if (a.name.toLowerCase() === 'mkr-infinity') return -1;
                if (b.name.toLowerCase() === 'mkr-infinity') return 1;
                if (a.name.toLowerCase() === 'boka') return -1;
                if (b.name.toLowerCase() === 'boka') return 1;
                return (b.has_pages ? 1 : 0) - (a.has_pages ? 1 : 0);
            })
            .slice(0, 9);
        
        if (filteredRepos.length === 0) {
            grid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No public repositories found.</p>';
            return;
        }

        const colors = ['red', 'blue', 'emerald', 'amber', 'purple', 'pink'];
        for (let i = 0; i < filteredRepos.length; i++) {
            const repo = filteredRepos[i];
            const color = colors[i % colors.length];
            let hasPages = repo.has_pages;
            const pagesUrl = `https://${repo.owner.login}.github.io/${repo.name}/`;
            const primaryUrl = hasPages ? pagesUrl : repo.html_url;
            const buttonText = hasPages ? 'View Live Demo' : 'View Source';
            const icon = hasPages ? 
                `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>` :
                `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;

            const card = document.createElement('div');
            card.className = `project-card border-${color} glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer`;
            card.innerHTML = `
                <div class="project-content relative z-10">
                    <div class="flex justify-between items-start mb-4">
                        ${icon}
                        <div class="flex items-center gap-2 text-xs font-mono opacity-50 text-red-400">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>${repo.language || 'Code'}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors text-white">${repo.name}</h3>
                    <p class="text-sm text-gray-400 line-clamp-2 mb-6">${repo.description || 'No description available.'}</p>
                    <div class="flex gap-4">
                        <a href="${primaryUrl}" target="_blank" class="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-amber-500/70 group-hover:text-amber-500 transition-colors">
                            ${buttonText} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                        ${hasPages ? `
                        <a href="${repo.html_url}" target="_blank" class="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                            Repo
                        </a>` : ''}
                    </div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            `;
            grid.appendChild(card);
        }
    } catch (e) {
        console.error('Failed to fetch repos', e);
        grid.innerHTML = '<p class="text-gray-500 col-span-full text-center">Failed to load repositories. Please check back later.</p>';
    }
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    
    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            menu.classList.toggle('active');
            const isActive = menu.classList.contains('active');
            menu.style.opacity = isActive ? '1' : '0';
            menu.style.pointerEvents = isActive ? 'auto' : 'none';
            menu.style.transform = isActive ? 'translateY(0)' : 'translateY(1rem)';
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('active');
                if (btn) btn.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.pointerEvents = 'none';
                menu.style.transform = 'translateY(1rem)';
            }
        });

        window.addEventListener('scroll', () => {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (btn) btn.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.pointerEvents = 'none';
                menu.style.transform = 'translateY(1rem)';
            }
        });
    }
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (btn) btn.classList.remove('active');
            if (menu) {
                menu.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.pointerEvents = 'none';
                menu.style.transform = 'translateY(1rem)';
            }
        });
    });
}


// Loading Screen Logic
function initLoadingScreen() {
    const loaderContainer = document.getElementById('loader-container');
    const loadingScreen = document.getElementById('loading-screen');
    if (!loaderContainer || !loadingScreen) return;

    const loaders = [
        '<div class="loader-1"><div class="pulse-logo"></div></div>',
        '<div class="loader-2"><div class="rings"></div></div>',
        '<div class="loader-3"><div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>',
        '<div class="loader-4"><div class="scan-container"><div class="scan-bar"></div></div></div>'
    ];

    const randomLoader = loaders[Math.floor(Math.random() * loaders.length)];
    loaderContainer.innerHTML = randomLoader;

    // Random duration between 2s and 3s
    const duration = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, duration);
}

// Dot Cursor
function initDotCursor() {
    const cursor = document.getElementById('dot-cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });

    function animate() {
        let dx = mouseX - cursorX;
        let dy = mouseY - cursorY;

        cursorX += dx * 0.2;
        cursorY += dy * 0.2;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animate);
    }
    animate();
}

// Modern Menu Logic
function initModernMenu() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('close-menu');
    const menu = document.getElementById('modern-menu');
    const nav = document.getElementById('main-nav');
    const links = document.querySelectorAll('.menu-link');

    toggleBtn?.addEventListener('click', () => {
        menu?.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
        menu?.classList.remove('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu?.classList.remove('active');
        });
    });

    // Hide on scroll up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
            nav.style.transform = 'translateY(0)';
        } else {
            nav.style.transform = 'translateY(-100%)';
        }
        lastScrollY = currentScrollY;
        
        // Close menu on scroll
        if (menu?.classList.contains('active')) {
            menu.classList.remove('active');
        }
    });
}

// Update Theme logic
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.remove('light');
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light');
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme === 'dark');

    themeToggle?.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light');
        applyTheme(isLight);
    });
}


// Scroll Dodge Logic
function initScrollDodge() {
    const btn = document.getElementById('dodge-button');
    if (!btn) return;
    
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const diff = currentScrollY - lastScrollY;
        
        if (Math.abs(diff) > 5) {
            const dodgeAmount = Math.min(Math.abs(diff) * 2, 100);
            const direction = diff > 0 ? 1 : -1;
            btn.style.transform = `translateY(${direction * dodgeAmount}px)`;
            
            clearTimeout(btn.dodgeTimeout);
            btn.dodgeTimeout = setTimeout(() => {
                btn.style.transform = 'translateY(0)';
            }, 500);
        }
        lastScrollY = currentScrollY;
    });
}

// Main Init
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initDotCursor();
    initModernMenu();
    const splash = document.getElementById('splash-screen');
    if (splash) splash.remove();

    const particles = new ParticleNetwork();
    initTypingEffect();
    initSkills();
    fetchProjects();
    initWalletCopy();
    initMobileMenu();
    initRealSnake();
    initCSSDragon();
    initSnakeGame();
    initTheme();
    initDragonParallax();
    initScrollDodge();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const themeColor = getComputedStyle(entry.target).getPropertyValue('--theme-color');
                if (themeColor && particles.setColor) particles.setColor(themeColor);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-theme').forEach(section => observer.observe(section));
});
