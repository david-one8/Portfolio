// ============================================
// DARK/LIGHT MODE THEME TOGGLE
// ============================================

/**
 * Calculate and set the theme based on user preference cascade:
 * 1. localStorage (user's previous choice)
 * 2. System preference (prefers-color-scheme)
 * 3. Default to light theme
 */

// Function to calculate theme setting
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }

    if (systemSettingDark.matches) {
        return 'dark';
    }

    return 'light';
}

// Function to update theme on the document
function updateThemeOnDocument(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

// Get initial theme preference
const localStorageTheme = localStorage.getItem('theme');
const systemSettingDark = window.matchMedia('(prefers-color-scheme: dark)');

// Calculate current theme
let currentThemeSetting = calculateSettingAsThemeString({ 
    localStorageTheme, 
    systemSettingDark 
});

// Apply theme immediately (before page renders)
updateThemeOnDocument(currentThemeSetting);

// Wait for DOM to be ready before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // Toggle theme
            const newTheme = currentThemeSetting === 'dark' ? 'light' : 'dark';
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update current setting
            currentThemeSetting = newTheme;
            
            // Update DOM
            updateThemeOnDocument(newTheme);
        });
    }
    
    // Listen for system theme changes
    systemSettingDark.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        
        // Only update if user hasn't set a preference
        if (localStorage.getItem('theme') === null) {
            currentThemeSetting = newTheme;
            updateThemeOnDocument(newTheme);
        }
    });
});


// ============================================
// NAVIGATION
// ============================================

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Add scrolled class to navbar
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// ANIMATED STATISTICS COUNTER
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

const animateStats = () => {
    if (hasAnimated) return;
    
    const statsSection = document.querySelector('.about-stats');
    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75) {
        hasAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 50;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 30);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
};

window.addEventListener('scroll', animateStats);

// ============================================
// PORTFOLIO MODAL
// ============================================
const modal = document.getElementById('portfolio-modal');
const closeModal = document.querySelector('.close-modal');
const viewDetailsButtons = document.querySelectorAll('.view-details');

// Portfolio project data
const projectsData = {
    1: {
        title: 'Luxe Cosmetics Brand Identity',
        description: 'A comprehensive brand identity project for a luxury cosmetics company. This project included logo design, brand guidelines, packaging design, and complete marketing materials. The goal was to create a sophisticated, timeless brand that appeals to modern consumers while maintaining an air of elegance and exclusivity.',
        client: 'Luxe Cosmetics Inc.',
        year: '2024',
        category: 'Brand Identity',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop'
    },
    2: {
        title: 'TechFlow UI/UX Design',
        description: 'Modern website design for a SaaS technology company focused on workflow automation. The project emphasized clean design, intuitive user experience, and conversion optimization. Created wireframes, prototypes, and final designs for desktop and mobile platforms.',
        client: 'TechFlow Solutions',
        year: '2024',
        category: 'Digital Design',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop'
    },
    3: {
        title: 'Annual Report Design',
        description: 'Creative annual report layout featuring custom infographics, data visualization, and compelling storytelling. The design balanced professionalism with visual interest, making complex financial data accessible and engaging for stakeholders.',
        client: 'Global Finance Corp',
        year: '2023',
        category: 'Print Design',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1200&h=800&fit=crop'
    },
    4: {
        title: 'Artisan Coffee Logo Suite',
        description: 'Complete logo design and brand guidelines for an artisan coffee roastery. The project included primary and secondary logos, icon variations, typography system, color palette, and application examples. The design captures the craftsmanship and passion behind artisan coffee.',
        client: 'Artisan Coffee Roasters',
        year: '2024',
        category: 'Branding',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop'
    },
    5: {
        title: 'Social Media Campaign',
        description: 'Comprehensive social media template system and content design for a fashion brand\'s seasonal campaign. Created cohesive visual language across Instagram, Facebook, and Pinterest, resulting in 300% increase in engagement.',
        client: 'Fashion Forward',
        year: '2024',
        category: 'Digital Design',
        image: 'https://images.unsplash.com/photo-1523742348304-8e67f3cafc08?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    6: {
        title: 'Custom Illustrations',
        description: 'Series of custom illustrations for a children\'s educational platform. The illustrations needed to be colorful, engaging, and educational while maintaining consistency across different learning modules. Created 50+ unique illustrations.',
        client: 'EduKids Platform',
        year: '2023',
        category: 'Illustration',
        image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=1200&h=800&fit=crop'
    }
};

// Open modal with project details
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = button.getAttribute('data-project');
        const project = projectsData[projectId];
        
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-client').textContent = project.client;
        document.getElementById('modal-year').textContent = project.year;
        document.getElementById('modal-category').textContent = project.category;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// CONTACT FORM VALIDATION
// ============================================
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

// Email validation regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Validate individual field
const validateField = (field) => {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    // Check if empty
    if (field.value.trim() === '') {
        isValid = false;
        message = 'This field is required';
    }
    
    // Specific validation for email
    if (field.type === 'email' && field.value.trim() !== '') {
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }

    // Specific validation for name (minimum 2 characters)
    if (field.id === 'name' && field.value.trim() !== '') {
        if (field.value.trim().length < 2) {
            isValid = false;
            message = 'Name must be at least 2 characters';
        }
    }

    // Specific validation for message (minimum 10 characters)
    if (field.id === 'message' && field.value.trim() !== '') {
        if (field.value.trim().length < 10) {
            isValid = false;
            message = 'Message must be at least 10 characters';
        }
    }

    // Apply error class and message
    if (!isValid) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    } else {
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
    }

    return isValid;
};

// Real-time validation on input
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });

    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
            validateField(input);
        }
    });
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate all fields
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    // If form is valid, show success message
    if (isFormValid) {
        // Hide form and show success message
        contactForm.style.display = 'none';
        successMessage.classList.add('show');

        // Reset form after 5 seconds
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            successMessage.classList.remove('show');
            
            // Remove all error states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            document.querySelectorAll('.error-message').forEach(msg => {
                msg.textContent = '';
            });
        }, 5000);

        // In production, you would send the form data to a server here
        // Example:
        // const formData = new FormData(contactForm);
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // });
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ============================================
// SMOOTH SCROLL ANIMATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to portfolio items
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(item);
});

// Apply fade-in animation to skill items
document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(item);
});
