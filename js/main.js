/* ============================================================
   AXA EN FRANCE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initQuoteTabs();
    initScrollAnimations();
    initQuoteForm();
});

/* ── Sticky Header ───────────────────────────────────────── */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ── Mobile Menu ─────────────────────────────────────────── */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Toggle dropdown on mobile
    const dropdownItems = nav.querySelectorAll('.nav__item--has-dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav__link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('open');
            }
        });
    });
}

/* ── Quote Tabs ──────────────────────────────────────────── */
function initQuoteTabs() {
    const tabs = document.querySelectorAll('.quick-quote__tab');
    const fieldsContainer = document.getElementById('quoteFields');
    if (!tabs.length || !fieldsContainer) return;

    const formConfigs = {
        auto: [
            { label: 'Type de véhicule', type: 'select', options: ['Voiture', 'Moto / Scooter', 'Utilitaire'] },
            { label: 'Date de naissance', type: 'date' },
            { label: 'Code postal', type: 'text', placeholder: 'ex: 75001', maxlength: '5' }
        ],
        habitation: [
            { label: 'Type de logement', type: 'select', options: ['Appartement', 'Maison', 'Studio'] },
            { label: 'Nombre de pièces', type: 'select', options: ['1', '2', '3', '4', '5+'] },
            { label: 'Code postal', type: 'text', placeholder: 'ex: 75001', maxlength: '5' }
        ],
        sante: [
            { label: 'Régime', type: 'select', options: ['Salarié', 'TNS', 'Retraité', 'Étudiant'] },
            { label: 'Date de naissance', type: 'date' },
            { label: 'Code postal', type: 'text', placeholder: 'ex: 75001', maxlength: '5' }
        ],
        epargne: [
            { label: 'Objectif', type: 'select', options: ['Épargner', 'Préparer la retraite', 'Transmettre'] },
            { label: 'Budget mensuel', type: 'select', options: ['50 - 100€', '100 - 300€', '300 - 500€', '500€+'] },
            { label: 'Horizon de placement', type: 'select', options: ['Moins de 5 ans', '5 à 10 ans', 'Plus de 10 ans'] }
        ]
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('quick-quote__tab--active'));
            tab.classList.add('quick-quote__tab--active');

            const tabName = tab.dataset.tab;
            const config = formConfigs[tabName];
            if (!config) return;

            fieldsContainer.innerHTML = config.map(field => {
                let input;
                if (field.type === 'select') {
                    input = `<select>${field.options.map(o => `<option>${o}</option>`).join('')}</select>`;
                } else if (field.type === 'date') {
                    input = `<input type="date">`;
                } else {
                    input = `<input type="${field.type}" placeholder="${field.placeholder || ''}" ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}>`;
                }
                return `
                    <div class="quick-quote__field">
                        <label>${field.label}</label>
                        ${input}
                    </div>
                `;
            }).join('');
        });
    });
}

/* ── Quote Form ──────────────────────────────────────────── */
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const activeTab = document.querySelector('.quick-quote__tab--active');
        const product = activeTab ? activeTab.dataset.tab : 'auto';

        const pageMap = {
            auto: 'pages/auto.html',
            habitation: 'pages/habitation.html',
            sante: 'pages/sante.html',
            epargne: 'pages/epargne.html'
        };

        window.location.href = pageMap[product] || '#';
    });
}

/* ── Scroll Animations ───────────────────────────────────── */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.product-card, .advantage-card, .testimonial-card, .news-card, .section-header'
    );

    if (!animatedElements.length) return;

    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}
