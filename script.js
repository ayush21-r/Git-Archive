/* Git-Archive Data & Logic */

const gitData = [
    {
        category: "Setup & Configuration",
        icon: "fa-cog",
        commands: [
            { cmd: 'git config --global user.name "Name"', desc: "Set your Git username for commits" },
            { cmd: 'git config --global user.email "email"', desc: "Set your Git email for commits" },
            { cmd: 'git config --global core.editor code', desc: "Set VS Code as default editor" },
            { cmd: 'git config --global init.defaultBranch main', desc: "Set default branch name to 'main'" },
            { cmd: 'git config --list', desc: "Show all configuration settings" }
        ]
    },
    {
        category: "How to Send Project to GitHub",
        icon: "fa-rocket",
        commands: [
            { cmd: 'git init', desc: "Creates a new Git repository" },
            { cmd: 'git add .', desc: "Adds all files to staging" },
            { cmd: 'git commit -m "Initial commit"', desc: "Saves your changes" },
            { cmd: 'git remote add origin https://github.com/USER/REPO.git', desc: "Connects local repo to GitHub" },
            { cmd: 'git remote -v', desc: "Confirms GitHub connection" },
            { cmd: 'git branch -M main', desc: "Sets branch name to main" },
            { cmd: 'git push -u origin main', desc: "Uploads project to GitHub" },
            { cmd: 'git add .', desc: "Stage new changes" },
            { cmd: 'git commit -m "update"', desc: "Save new changes" },
            { cmd: 'git push', desc: "Send updates to GitHub" }
        ],
        troubleshooting: [
            { problem: "Remote has files", fix: "git pull origin main --allow-unrelated-histories" },
            { problem: "Wrong branch name", fix: "git branch -M main" },
            { problem: "Permission error", fix: "Check GitHub login / token" }
        ]
    },
    {
        category: "Create / Clone",
        icon: "fa-plus-square",
        commands: [
            { cmd: 'git clone <url>', desc: "Clone a remote repository" },
            { cmd: 'git clone <url> folder', desc: "Clone into a specific folder name" },
            { cmd: 'git clone -b branch <url>', desc: "Clone a specific branch only" },
            { cmd: 'git clone --depth 1 <url>', desc: "Shallow clone (latest commit only)" }
        ]
    },
    {
        category: "Basic Snapshot",
        icon: "fa-camera",
        commands: [
            { cmd: 'git status', desc: "Check status of working directory" },
            { cmd: 'git add file', desc: "Stage a specific file" },
            { cmd: 'git commit --amend', desc: "Modify the previous commit" },
            { cmd: 'git diff', desc: "Show unstaged changes" },
            { cmd: 'git diff --staged', desc: "Show staged changes" }
        ]
    },
    {
        category: "Branching & Merging",
        icon: "fa-code-branch",
        commands: [
            { cmd: 'git branch', desc: "List all local branches" },
            { cmd: 'git branch <name>', desc: "Create a new branch" },
            { cmd: 'git switch <name>', desc: "Switch to a branch" },
            { cmd: 'git merge <name>', desc: "Merge branch into current one" },
            { cmd: 'git branch -d <name>', desc: "Delete a branch (safe)" }
        ]
    },
    {
        category: "Remote & Sync",
        icon: "fa-cloud",
        commands: [
            { cmd: 'git fetch', desc: "Download changes (no merge)" },
            { cmd: 'git pull', desc: "Fetch and merge changes" }
        ]
    },
    {
        category: "Undo & Fix",
        icon: "fa-undo",
        commands: [
            { cmd: 'git checkout -- file', desc: "Discard changes in a file" },
            { cmd: 'git restore file', desc: "Restore file (modern syntax)" },
            { cmd: 'git reset --soft HEAD~1', desc: "Undo commit, keep changes staged" },
            { cmd: 'git reset --hard HEAD', desc: "Discard all local changes" },
            { cmd: 'git revert <commit>', desc: "Create a new commit undoing changes" }
        ]
    },
    {
        category: "Advanced / Stash",
        icon: "fa-box-archive",
        commands: [
            { cmd: 'git stash', desc: "Save uncommitted changes temporarily" },
            { cmd: 'git stash pop', desc: "Apply and delete latest stash" },
            { cmd: 'git log --oneline --graph', desc: "View clean history graph" },
            { cmd: 'git cherry-pick <commit>', desc: "Apply a commit from another branch" }
        ]
    }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    renderContent();
    setupInteractions();
    setupScrollReveal();
});

// --- Loader ---
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 1500); 
}

// --- Render Content ---
function renderContent() {
    const grid = document.getElementById('commandGrid');
    const catList = document.getElementById('categoryList');
    
    if(!grid || !catList) return;

    grid.innerHTML = '';
    catList.innerHTML = '';

    // 1. Render Git Sections
    gitData.forEach((section, index) => {
        // Sidebar
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#cat-${index}`;
        link.className = 'cat-link';
        link.innerHTML = `<i class="fa-solid ${section.icon}"></i> ${section.category}`;
        
        // Link click handling (also closes sidebar on mobile)
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(`cat-${index}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        });
        li.appendChild(link);
        catList.appendChild(li);

        // Section
        const sectionEl = document.createElement('div');
        sectionEl.className = 'category-section reveal';
        sectionEl.id = `cat-${index}`;

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.innerHTML = `<i class="fa-solid ${section.icon}"></i> ${section.category}`;
        sectionEl.appendChild(title);

        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'cards-grid';

        section.commands.forEach(item => {
            const card = document.createElement('div');
            card.className = 'cmd-card';
            
            card.innerHTML = `
                <div class="cmd-header">
                    <code class="cmd-code">${item.cmd}</code>
                    <button class="copy-btn" title="Copy command">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
                <p class="cmd-desc">${item.desc}</p>
            `;
            
            // Add event listener to the copy button
            const btn = card.querySelector('.copy-btn');
            btn.addEventListener('click', () => copyToClipboard(item.cmd, btn));

            cardsDiv.appendChild(card);
        });

        sectionEl.appendChild(cardsDiv);

        // Troubleshooting Box
        if (section.troubleshooting) {
            const troubleBox = document.createElement('div');
            troubleBox.className = 'trouble-box';
            
            let rows = '';
            section.troubleshooting.forEach(row => {
                rows += `<tr><td>${row.problem}</td><td><code>${row.fix}</code></td></tr>`;
            });

            troubleBox.innerHTML = `
                <div class="trouble-header"><i class="fa-solid fa-triangle-exclamation"></i> Troubleshooting</div>
                <table class="trouble-table">
                    <thead><tr><th>Problem</th><th>Fix</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
            sectionEl.appendChild(troubleBox);
        }

        grid.appendChild(sectionEl);
    });

    // 2. Render About Section
    renderAboutSection(grid);
}

function renderAboutSection(container) {
    const aboutDiv = document.createElement('div');
    aboutDiv.className = 'category-section reveal about-container';
    aboutDiv.innerHTML = `
        <h2 class="category-title"><i class="fa-solid fa-user-astronaut"></i> About the Creator</h2>
        <div class="about-card">
            <div class="about-content">
                <div class="about-header">
                    <h3>Ayush Roy</h3>
                    <span class="role-badge">Developer & Engineer</span>
                </div>
                <p class="about-text">
                    Hi, I’m Ayush Roy. I enjoy building clean, practical tools for modern developers.<br>
                    This project is my attempt to make Git simpler, faster and more accessible especially for beginners.
                </p>
                <div class="about-actions">
                    <a href="https://www.linkedin.com/in/ayush-roy-206309321" target="_blank" class="btn btn-primary">
                        <i class="fa-brands fa-linkedin"></i> Connect on LinkedIn
                    </a>
                    <a href="mailto:ayushroy21205@gmail.com" class="btn btn-secondary" id="emailBtn">
                        <i class="fa-solid fa-envelope"></i> Send Email
                    </a>
                </div>
            </div>
        </div>
    `;
    container.appendChild(aboutDiv);

    // --- Add Smart Copy Functionality to Email Button ---
    const emailBtn = aboutDiv.querySelector('#emailBtn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            const email = "ayushroy21205@gmail.com";
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    const originalHTML = emailBtn.innerHTML;
                    emailBtn.innerHTML = '<i class="fa-solid fa-check"></i> Email Copied!';
                    setTimeout(() => {
                        emailBtn.innerHTML = originalHTML;
                    }, 2500);
                });
            }
        });
    }
}

// --- Scroll Reveal ---
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);
}

// --- Interactions ---
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-success)"></i>';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
}

// --- Mobile Menu Functions ---
function openMobileMenu() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('active');
}

function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
}

function setupInteractions() {
    const searchInput = document.getElementById('searchInput');
    const themeBtn = document.getElementById('themeToggle');
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    // Mobile Menu Controls
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('sidebarOverlay');

    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileMenu);
    if(overlay) overlay.addEventListener('click', closeMobileMenu);

    // Search
    if(searchInput) {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.cmd-card');
            const sections = document.querySelectorAll('.category-section:not(.about-container)'); 

            cards.forEach(card => {
                const cmd = card.querySelector('.cmd-code').textContent.toLowerCase();
                const desc = card.querySelector('.cmd-desc').textContent.toLowerCase();
                const isMatch = cmd.includes(term) || desc.includes(term);
                card.style.display = isMatch ? 'block' : 'none';
            });

            sections.forEach(section => {
                const visibleCards = Array.from(section.querySelectorAll('.cmd-card')).filter(c => c.style.display !== 'none');
                section.style.display = visibleCards.length ? 'block' : 'none';
            });
        });
    }

    // Theme Toggle (Default Dark -> Toggle Light)
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeBtn.querySelector('i');
            themeBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => themeBtn.style.transform = 'rotate(0deg)', 300);

            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fa-solid fa-moon'; // Show moon when in light mode (to switch back)
            } else {
                icon.className = 'fa-solid fa-sun'; // Show sun when in dark mode
            }
        });
    }

    // Scroll Top
    if(scrollBtn) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const bar = document.querySelector('.scroll-bar');
            if(bar) bar.style.width = (winScroll / height) * 100 + "%";

            if (winScroll > 400) scrollBtn.classList.add('visible');
            else scrollBtn.classList.remove('visible');

            highlightSidebar();
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function highlightSidebar() {
    const sections = document.querySelectorAll('.category-section');
    const navLinks = document.querySelectorAll('.cat-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}