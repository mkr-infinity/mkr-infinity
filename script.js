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
        "Channel Specialist",
        "Community Manager",
        "Profile Optimizer"
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

// Skills Injection
function initSkills() {
    const skills = [
        { name: 'Solidity', icon: '💎' },
        { name: 'React', icon: '⚛️' },
        { name: 'Python', icon: '🐍' },
        { name: 'Ethers.js', icon: '⚡' },
        { name: 'Tailwind', icon: '🎨' },
        { name: 'Web3.js', icon: '🌐' }
    ];
    
    const grid = document.getElementById('skills-grid');
    if (grid) {
        grid.innerHTML = '';
        skills.forEach((skill, i) => {
            const div = document.createElement('div');
            div.className = 'glass p-8 rounded-2xl border border-red-900/20 animate-float h-full flex flex-col items-center justify-center gap-4 group hover:border-amber-500/30 transition-all';
            div.style.animationDelay = `${i * 0.2}s`;
            div.innerHTML = `
                <span class="text-4xl group-hover:scale-125 transition-transform">${skill.icon}</span>
                <span class="font-bold tracking-tight text-gray-200">${skill.name}</span>
            `;
            grid.appendChild(div);
        });
    }
}

// GitHub Projects Fetcher
async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const skipRepos = ['kaif', 'sonu', 'period-calculator'];
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

// Copy Wallet
function initWalletCopy() {
    document.querySelectorAll('.wallet-card').forEach(card => {
        card.addEventListener('click', () => {
            const address = card.dataset.address;
            navigator.clipboard.writeText(address);
            
            const toast = document.getElementById('toast');
            if (toast) {
                toast.style.transform = 'translate(-50%, 0)';
                toast.style.opacity = '1';
                
                setTimeout(() => {
                    toast.style.transform = 'translate(-50%, 20px)';
                    toast.style.opacity = '0';
                }, 3000);
            }
        });
    });
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

// Real Snake Animation
function initRealSnake() {
    const container = document.getElementById('real-snake-container');
    if (!container) return;

    const segments = 25;
    const bodyParts = [];
    const radius = 130;
    let angle = 0;
    
    let moveX = 0;
    let moveY = 0;
    let targetMoveX = 0;
    let targetMoveY = 0;

    for (let i = 0; i < segments; i++) {
        const part = document.createElement('div');
        part.className = 'snake-body';
        container.appendChild(part);
        bodyParts.push({
            el: part,
            x: 0,
            y: 0
        });
    }

    function animateSnake() {
        angle += 0.03;
        
        if (Math.random() < 0.02) {
            targetMoveX = (Math.random() - 0.5) * 60;
            targetMoveY = (Math.random() - 0.5) * 60;
        }
        
        moveX += (targetMoveX - moveX) * 0.05;
        moveY += (targetMoveY - moveY) * 0.05;
        
        bodyParts.forEach((part, i) => {
            const individualAngle = angle - (i * 0.15);
            const x = Math.cos(individualAngle) * radius + (container.offsetWidth / 2) + moveX;
            const y = Math.sin(individualAngle) * radius + (container.offsetHeight / 2) + moveY;
            
            part.el.style.left = `${x}px`;
            part.el.style.top = `${y}px`;
            part.el.style.opacity = 1 - (i / segments);
            part.el.style.transform = `scale(${1.2 - (i / segments)})`;
        });
        
        requestAnimationFrame(animateSnake);
    }
    animateSnake();
}

// Dragon Parallax Effect
function initDragonParallax() {
}

// CSS Dragon Follower (Multi-segment)
function initCSSDragon() {
    const dragonContainer = document.getElementById('css-dragon');
    if (!dragonContainer) return;

    const segments = [];
    const segmentCount = 18;
    const gap = 20;

    for (let i = 0; i < segmentCount; i++) {
        const seg = document.createElement('div');
        seg.className = 'dragon-segment';
        
        if (i === 0 || i === 4 || i === 8) {
            const leftWing = document.createElement('div');
            leftWing.className = 'dragon-wing left';
            leftWing.style.animationDelay = `${i * 0.1}s`;
            const rightWing = document.createElement('div');
            rightWing.className = 'dragon-wing right';
            rightWing.style.animationDelay = `${i * 0.1}s`;
            seg.appendChild(leftWing);
            seg.appendChild(rightWing);
        }
        
        if (i > 0 && i < segmentCount - 1) {
            const branchCount = 2;
            for (let b = 0; b < branchCount; b++) {
                const branch = document.createElement('div');
                branch.className = 'dragon-branch';
                branch.style.transform = `rotate(${Math.random() * 360}deg) translateY(-20px)`;
                seg.appendChild(branch);
            }
        }

        if (i === 0) {
            seg.classList.add('dragon-head-segment');
        }

        dragonContainer.appendChild(seg);
        segments.push({
            el: seg,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const updateMouse = (e) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        if (x !== undefined && y !== undefined) {
            mouseX = x;
            mouseY = y;
        }
    };

    window.addEventListener('mousemove', updateMouse);
    window.addEventListener('touchstart', updateMouse);
    window.addEventListener('touchmove', updateMouse);

    function animate() {
        segments[0].x += (mouseX - segments[0].x) * 0.1;
        segments[0].y += (mouseY - segments[0].y) * 0.1;

        for (let i = 1; i < segmentCount; i++) {
            const prev = segments[i - 1];
            const curr = segments[i];
            
            const dx = prev.x - curr.x;
            const dy = prev.y - curr.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            if (distance > gap) {
                curr.x = prev.x - Math.cos(angle) * gap;
                curr.y = prev.y - Math.sin(angle) * gap;
            }
        }

        segments.forEach((seg, i) => {
            seg.el.style.left = `${seg.x}px`;
            seg.el.style.top = `${seg.y}px`;
            
            let angle = 0;
            if (i < segmentCount - 1) {
                const next = segments[i + 1];
                angle = Math.atan2(seg.y - next.y, seg.x - next.x);
            } else {
                const prev = segments[i - 1];
                angle = Math.atan2(prev.y - seg.y, prev.x - seg.x);
            }
            seg.el.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scale(${1.2 - i * 0.04})`;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Snake Game Logic
function initSnakeGame() {
    const canvas = document.getElementById('snake-game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-game-btn');
    const overlay = document.getElementById('game-overlay');
    const scoreEl = document.getElementById('current-score');
    const highscoreEl = document.getElementById('all-time-high');
    const highscoreDateEl = document.getElementById('high-score-date');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    const savedData = JSON.parse(localStorage.getItem('snake_highscore') || '{"score": 0, "date": "N/A"}');
    highscoreEl.textContent = savedData.score;
    highscoreDateEl.textContent = `Achieved on: ${savedData.date}`;

    function drawGame() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = score;
            createFood();
        } else {
            snake.pop();
        }

        ctx.fillStyle = document.body.classList.contains('light') ? '#f0f4f8' : '#0d0d0d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for(let i=0; i<tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        const dragonColor = getComputedStyle(document.body).getPropertyValue('--dragon-color').trim() || '#ff0000';
        snake.forEach((segment, i) => {
            ctx.fillStyle = dragonColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = dragonColor;
            
            ctx.beginPath();
            ctx.roundRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        ctx.fillStyle = '#ffd700';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function createFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        if (snake.some(s => s.x === food.x && s.y === food.y)) createFood();
    }

    function gameOver() {
        clearInterval(gameInterval);
        const currentData = JSON.parse(localStorage.getItem('snake_highscore') || '{"score": 0, "date": "N/A"}');
        if (score > currentData.score) {
            const now = new Date();
            const dateStr = now.toLocaleString();
            localStorage.setItem('snake_highscore', JSON.stringify({score: score, date: dateStr}));
            highscoreEl.textContent = score;
            highscoreDateEl.textContent = `Achieved on: ${dateStr}`;
        }
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.querySelector('h3').textContent = "MISSION FAILED";
        startBtn.textContent = "RETRY MISSION";
    }

    function startGame() {
        snake = [{x: 10, y: 10}];
        score = 0;
        scoreEl.textContent = score;
        dx = 1;
        dy = 0;
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, 100);
    }

    startBtn.addEventListener('click', startGame);

    window.addEventListener('keydown', e => {
        switch(e.key) {
            case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
        }
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
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

// 3D Dragon Animation with Three.js
class Dragon3D {
    constructor() {
        this.container = document.getElementById('dragon-3d-container');
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        this.dragon = new THREE.Group();
        this.scene.add(this.dragon);
        
        this.initLights();
        this.createDragonBody();
        this.initParticles();
        
        this.camera.position.z = 5;
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', () => this.onMouseClick());
        
        this.animate();
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xff0000, 2, 10);
        pointLight.position.set(2, 2, 2);
        this.scene.add(pointLight);
    }

    createDragonBody() {
        const bodyGeo = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0xaa0000, shininess: 100 });
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.rotation.z = Math.PI / 2;
        this.dragon.add(this.body);

        const headGeo = new THREE.ConeGeometry(0.4, 0.8, 8);
        this.head = new THREE.Mesh(headGeo, bodyMat);
        this.head.position.x = 1.5;
        this.head.rotation.z = -Math.PI / 2;
        this.dragon.add(this.head);

        const wingGeo = new THREE.PlaneGeometry(1.5, 1);
        const wingMat = new THREE.MeshPhongMaterial({ color: 0x880000, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        this.leftWing = new THREE.Mesh(wingGeo, wingMat);
        this.leftWing.position.set(0, 0.5, 0.5);
        this.leftWing.rotation.x = Math.PI / 4;
        this.dragon.add(this.leftWing);

        this.rightWing = new THREE.Mesh(wingGeo, wingMat);
        this.rightWing.position.set(0, 0.5, -0.5);
        this.rightWing.rotation.x = -Math.PI / 4;
        this.dragon.add(this.rightWing);
    }

    initParticles() {
        this.particleCount = 50;
        this.particles = new THREE.Group();
        this.scene.add(this.particles);
        const pGeo = new THREE.SphereGeometry(0.05, 4, 4);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        for(let i=0; i<this.particleCount; i++) {
            const p = new THREE.Mesh(pGeo, pMat);
            p.visible = false;
            this.particles.add(p);
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.targetRotation.y = this.mouse.x * 0.5;
        this.targetRotation.x = -this.mouse.y * 0.5;
    }

    onMouseClick() {
        this.particles.children.forEach((p, i) => {
            p.visible = true;
            p.position.copy(this.head.position);
            p.userData.velocity = new THREE.Vector3(
                (Math.random() + 1) * 0.1,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            p.userData.life = 1.0;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = Date.now() * 0.002;
        this.dragon.position.y = Math.sin(time) * 0.2;
        this.dragon.rotation.z = Math.sin(time * 0.5) * 0.1;
        this.leftWing.rotation.x = Math.PI / 4 + Math.sin(time * 2) * 0.5;
        this.rightWing.rotation.x = -Math.PI / 4 - Math.sin(time * 2) * 0.5;
        this.dragon.rotation.x += (this.targetRotation.x - this.dragon.rotation.x) * 0.1;
        this.dragon.rotation.y += (this.targetRotation.y - this.dragon.rotation.y) * 0.1;
        this.particles.children.forEach(p => {
            if(p.visible) {
                p.position.add(p.userData.velocity);
                p.userData.life -= 0.02;
                if(p.userData.life <= 0) p.visible = false;
            }
        });
        this.renderer.render(this.scene, this.camera);
    }
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
