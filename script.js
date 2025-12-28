/* Git-Archive
   Premium Developer Reference
   Data Source: "GIT COMPLETE COMMAND LIST"
*/

const gitData = [
    {
        category: "Setup & Configuration",
        icon: "fa-cog",
        commands: [
            { cmd: 'git config --global user.name "Name"', desc: "Set your Git username for commits" },
            { cmd: 'git config --global user.email "email"', desc: "Set your Git email for commits" },
            { cmd: 'git config --global core.editor code', desc: "Set VS Code as default editor" },
            { cmd: 'git config --global init.defaultBranch main', desc: "Set default branch name to 'main'" },
            { cmd: 'git config --list', desc: "Show all configuration settings" },
            { cmd: 'git help <command>', desc: "Get help for a specific command" }
        ]
    },
    {
        category: "Create / Clone",
        icon: "fa-plus-square",
        commands: [
            { cmd: 'git init', desc: "Initialize a new Git repository" },
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
            { cmd: 'git add .', desc: "Stage all changes" },
            { cmd: 'git add file', desc: "Stage a specific file" },
            { cmd: 'git commit -m \"msg\"', desc: "Commit staged changes with message" },
            { cmd: 'git commit --amend', desc: "Modify the previous commit" }
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
            { cmd: 'git remote -v', desc: "List remote connections" },
            { cmd: 'git fetch', desc: "Download changes (no merge)" },
            { cmd: 'git pull', desc: "Fetch and merge changes" },
            { cmd: 'git push', desc: "Upload commits to remote" },
            { cmd: 'git push -u origin main', desc: "Push and set upstream tracking" }
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
            { cmd: 'git cherry-pick <commit>', desc: "Apply a commit from another branch" },
            { cmd: 'git bisect start', desc: "Start binary search for bugs" }
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

// --- 1. Loader Animation ---
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1500); 
}

// --- 2. Rendering ---
function renderContent() {
    const grid = document.getElementById('commandGrid');
    const catList = document.getElementById('categoryList');
    
    if(!grid || !catList) return;

    grid.innerHTML = '';
    catList.innerHTML = '';

    gitData.forEach((section, index) => {
        // Sidebar Link
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#cat-${index}`;
        link.className = 'cat-link';
        link.innerHTML = `<i class="fa-solid ${section.icon}"></i> ${section.category}`;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(`cat-${index}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        li.appendChild(link);
        catList.appendChild(li);

        // Main Section
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
            
            // Header
            const header = document.createElement('div');
            header.className = 'cmd-header';
            
            const code = document.createElement('code');
            code.className = 'cmd-code';
            code.textContent = item.cmd;
            
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.title = "Copy command";
            btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            btn.addEventListener('click', () => copyToClipboard(item.cmd, btn));

            header.appendChild(code);
            header.appendChild(btn);
            
            // Description
            const desc = document.createElement('p');
            desc.className = 'cmd-desc';
            desc.textContent = item.desc;

            card.appendChild(header);
            card.appendChild(desc);
            cardsDiv.appendChild(card);
        });

        sectionEl.appendChild(cardsDiv);
        grid.appendChild(sectionEl);
    });
}

// --- 3. Scroll Reveal ---
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- 4. Interactions ---

function copyToClipboard(text, btn) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            animateCheck(btn);
        });
    } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        animateCheck(btn);
    }
}

function animateCheck(btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-success)"></i>';
    setTimeout(() => btn.innerHTML = original, 2000);
}

function setupInteractions() {
    // Search
    const searchInput = document.getElementById('searchInput');
    
    // Keyboard Shortcut (/)
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.cmd-card');
            const sections = document.querySelectorAll('.category-section');

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

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeBtn.querySelector('i');
            
            // Spin animation
            themeBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => themeBtn.style.transform = 'rotate(0deg)', 300);

            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fa-solid fa-moon';
            } else {
                icon.className = 'fa-solid fa-sun';
            }
        });
    }

    // Scroll to Top & Sidebar Highlight
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const bar = document.querySelector('.scroll-bar');
        if(bar) bar.style.width = (winScroll / height) * 100 + "%";

        // Button Visibility
        if (winScroll > 400) scrollBtn.classList.add('visible');
        else scrollBtn.classList.remove('visible');

        // Sidebar Active State
        highlightSidebar();
    });

    if(scrollBtn) {
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