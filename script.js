/**
 * Global Navigation and Interaction Logic
 */

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    // Page Transition Init
    const transitionOverlay = document.getElementById('page-transition');
    if (transitionOverlay) {
        setTimeout(() => transitionOverlay.classList.add('page-transition-hidden'), 100);
    }

    // Cursor Glow Init
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // Particles Init
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

// Loading Screen & Logic Init
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('loader-hidden');
    }
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Set Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active-link');
        }
    });

    // Initial Render of Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        window.allProjects = getStoredProjects();
        renderProjects(window.allProjects);
    }
});

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    if (e.key === 'Enter') {
        const loginBtn = document.querySelector('#login-section button');
        if (loginBtn && document.activeElement.tagName === 'INPUT') {
            loginBtn.click();
        }
    }
});

/**
 * Gets projects from default data or localStorage.
 */
function getStoredProjects() {
    const saved = localStorage.getItem('customProjects');
    return saved ? JSON.parse(saved) : projects;
}

/**
 * Renders project cards.
 */
function renderProjects(projectsData) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (projectsData.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No projects found matching your criteria.</p>';
        return;
    }

    container.innerHTML = projectsData.map((project, index) => `
        <div class="project-card reveal" onclick="openModalById(${project.id})">
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        </div>
    `).join('');
    
    // Refresh Intersection Observer
    const revealElements = container.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => obs.observe(el));
    

}

/**
 * Search functionality.
 */
function filterGallery() {
    const query = document.getElementById('project-search').value.toLowerCase();
    const filtered = window.allProjects.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );
    renderProjects(filtered);
}

/**
 * Category filter functionality.
 */
function filterByCategory(category, btn) {
    // Update active button UI
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (category === 'all') {
        renderProjects(window.allProjects);
    } else {
        const filtered = window.allProjects.filter(p => p.category === category);
        renderProjects(filtered);
    }
}

/**
 * Opens modal by project ID.
 */
function openModalById(id) {
    const project = window.allProjects.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('portfolio-modal');
    if (!modal) return;

    document.getElementById('modal-img').src = project.image;
    document.getElementById('modal-title').innerText = project.title;
    document.getElementById('modal-desc').innerText = project.description;
    
    const linkBtn = document.getElementById('modal-link');
    if (project.link && project.link !== "#") {
        linkBtn.href = project.link;
        linkBtn.style.display = "inline-flex";
    } else {
        linkBtn.style.display = "none";
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Theme Toggle.
 */
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    showToast(`Switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'success');
}

/**
 * Toast Notification System.
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function navigateTo(url) {
    const transitionOverlay = document.getElementById('page-transition');
    if (transitionOverlay) {
        transitionOverlay.classList.remove('page-transition-hidden');
        setTimeout(() => window.location.href = url, 500);
    } else {
        window.location.href = url;
    }
}

// Floating Navbar Scroll Micro-interaction
window.addEventListener('scroll', () => {
    const navCenter = document.querySelector('.navigation-center');
    const navLeft = document.querySelector('.navigation-left');
    const threshold = 20;
    
    [navCenter, navLeft].forEach(nav => {
        if (nav) {
            if (window.scrollY > threshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
});// Mobile Navigation Menu Toggle Function
function toggleMobileMenu() {
    const menu = document.getElementById('nav-menu');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (menu) {
        menu.classList.toggle('active');
        toggleBtn.classList.toggle('open');
    }
}
