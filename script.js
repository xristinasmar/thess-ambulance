document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when ANY nav link is clicked
    function closeMobileMenu() {
        if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
                }

                // Header offset
                const headerHeight = document.querySelector('.header').offsetHeight;

                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting on scroll (only if on homepage)
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('folder/') || !window.location.pathname.includes('.html');

    if (isHomePage) {
        const sections = document.querySelectorAll('section, footer');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            const headerHeight = document.querySelector('.header').offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                    current = section.getAttribute('id') || '';
                }
            });

            if (pageYOffset < 100) {
                current = ''; // Top of page -> Home
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if ((href === '#' || href === 'index.html') && current === '') {
                    link.classList.add('active');
                } else if ((href === '#' + current || href === 'index.html#' + current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });
    }

    // ── Contact Form Validation ──────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const fields = {
        name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name'), msg: 'Παρακαλώ εισάγετε το ονοματεπώνυμό σας.' },
        phone: { el: document.getElementById('cf-phone'), err: document.getElementById('err-phone'), msg: 'Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου.' },
        email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email'), msg: 'Παρακαλώ εισάγετε έγκυρο email.' },
        message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message'), msg: 'Παρακαλώ γράψτε το μήνυμά σας.' },
    };

    const submitBtn = document.getElementById('cf-submit');
    const successBox = document.getElementById('formSuccess');

    function clearError(field) {
        field.el.classList.remove('error');
        field.err.textContent = '';
    }

    function setError(field) {
        field.el.classList.add('error');
        field.err.textContent = field.msg;
    }

    function validateEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function validatePhone(val) {
        return /^[\d\s\+\-]{7,}$/.test(val.trim());
    }

    // Live clearing of errors on input
    Object.values(fields).forEach(f => {
        f.el.addEventListener('input', () => clearError(f));
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Name
        if (fields.name.el.value.trim().length < 2) {
            setError(fields.name); valid = false;
        } else { clearError(fields.name); }

        // Phone
        if (!validatePhone(fields.phone.el.value)) {
            setError(fields.phone); valid = false;
        } else { clearError(fields.phone); }

        // Email (optional but validated if filled)
        const emailVal = fields.email.el.value.trim();
        if (emailVal && !validateEmail(emailVal)) {
            setError(fields.email); valid = false;
        } else { clearError(fields.email); }

        // Message
        if (fields.message.el.value.trim().length < 5) {
            setError(fields.message); valid = false;
        } else { clearError(fields.message); }

        if (!valid) return;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Αποστολή...';

        // ── Send via EmailJS ───────────────────────────────────────────
        // Συμπλήρωσε τα 3 παρακάτω με τα στοιχεία από το emailjs.com dashboard
        const EMAILJS_SERVICE_ID = 'service_uji3s44';   // π.χ. 'service_abc1234'
        const EMAILJS_TEMPLATE_ID = 'template_07i640r';  // π.χ. 'template_xyz9876'
        const EMAILJS_PUBLIC_KEY = 'j36XFpjh9f_tNREyy'; // Account → API Keys

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm, EMAILJS_PUBLIC_KEY)
            .then(() => {
                // Επιτυχία
                contactForm.style.display = 'none';
                successBox.style.display = 'block';
            })
            .catch(() => {
                // Σφάλμα
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Αποστολή Μηνύματος';
                const errBanner = document.getElementById('form-send-error');
                if (errBanner) errBanner.style.display = 'flex';
            });


    });
});
