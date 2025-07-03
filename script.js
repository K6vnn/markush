// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 2000);
});

// Theme Toggle
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');

function toggleTheme() {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.remove('dark');
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
});


// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navHeight = document.querySelector('nav').offsetHeight;
    const targetPosition = section.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    mobileMenu.classList.remove('show');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase() === sectionId) {
            link.classList.add('active');
        }
    });
}

// Active Section Detection
const sections = ['home', 'projects','services', 'contact'];
let activeSection = 'home';

window.addEventListener('scroll', () => {
    const navHeight = document.querySelector('nav').offsetHeight;
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= navHeight + 100 && rect.bottom >= navHeight + 100) {
            if (activeSection !== section) {
                activeSection = section;
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.textContent.toLowerCase() === section) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
});



// Porject


document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card1');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // animate only once
            }
        });
    }, { threshold: 0.5 }); // Adjust threshold as needed

    projectCards.forEach(card => {
        observer.observe(card);
    });
});


// Services Section

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    serviceCards.forEach(card => {
        observer.observe(card);
    });
});

// Review System


class ReviewSystem {
    constructor() {
        this.reviews = [];
        this.container = document.getElementById('reviews-container');
        this.userId = this.getOrCreateUserId(); // Unique ID for each user
        this.setupReviewForm();
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user-' + Math.random().toString(36).substr(2, 9); // Generate a random ID
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    setupReviewForm() {
        const reviewSection = document.getElementById('reviews');
        const form = document.createElement('form');
        form.className = 'review-form glow-purple';
        form.innerHTML = `
            <h3>Share Your Experience</h3>
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
                <label for="rating">Rating</label>
                <div class="rating-input">
                    <input type="number" id="rating" min="1" max="5" placeholder="5" required>
                    <span class="rating-hint">★ (1-5 stars)</span>
                </div>
            </div>
            <div class="form-group">
                <label for="review">Your Review</label>
                <textarea id="review" placeholder="Tell us about your experience..." required></textarea>
            </div>
            <button type="submit" class="project-button">Submit Review</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#name').value;
            const rating = parseInt(form.querySelector('#rating').value);
            const text = form.querySelector('#review').value;

            if (rating < 1 || rating > 5) {
                alert('Please enter a rating between 1 and 5');
                return;
            }

            this.addReview({
                author: name,
                rating: rating,
                text: text,
                date: new Date(),
                userId: this.userId // Assign the review to the current user
            });

            form.reset();
        });

        reviewSection.querySelector('.container').insertBefore(form, this.container);
    }

    addReview(review) {
        this.reviews.push(review);
        this.saveReviews();
        this.displayReviews();
    }

    createReviewElement(review, index) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card glow-purple';
        reviewElement.innerHTML = `
            <div class="stars">
                ${Array(5).fill('').map((_, i) => 
                    `<span class="${i < review.rating ? 'filled' : ''}">${i < review.rating ? '★' : '☆'}</span>`
                ).join('')}
            </div>
            <p class="review-text">"${review.text}"</p>
            <p class="review-author">${review.author}</p>
            <span class="review-date">${new Date(review.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</span>
        `;

        // Add delete button only if the review belongs to the current user
        if (review.userId === this.userId) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = '🗑 Delete';
            deleteBtn.addEventListener('click', () => this.deleteReview(index));
            reviewElement.appendChild(deleteBtn);
        }

        return reviewElement;
    }

    displayReviews() {
        this.container.innerHTML = '';
        this.reviews.forEach((review, index) => {
            this.container.appendChild(this.createReviewElement(review, index));
        });
    }

    deleteReview(index) {
        this.reviews.splice(index, 1); // Remove from array
        this.saveReviews();
        this.displayReviews(); // Refresh the UI
    }

    saveReviews() {
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }

    loadReviews() {
        const saved = localStorage.getItem('reviews');
        if (saved) {
            this.reviews = JSON.parse(saved);
            this.displayReviews();
        }
    }
}

  const images = [
    'assets/images/proyectos/anuel/anuel.jpg',
    'assets/images/proyectos/anuel/anuel2.jpg',
    'assets/images/proyectos/anuel/anuel3.jpg'
  ];

  let currentIndex = 0;
  const imgElement = document.getElementById('project-image-anuel');
  const fadeTime = 1000; // 1s fade
  const displayTime = 4000; // visible por 4s

  function fadeToNextImage() {
    // Fade out
    imgElement.classList.add('hidden');

    // Espera a que se desvanezca (1s)
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      
      // Cuando cargue la nueva imagen, se hace fade-in
      imgElement.onload = () => {
        imgElement.classList.remove('hidden');
      };

      // Cambiar la imagen (esto dispara onload)
      imgElement.src = images[currentIndex];

    }, fadeTime); // esperar a que se termine el fade-out antes de cambiar
  }

  // Primera llamada y luego cada X segundos
  setInterval(fadeToNextImage, displayTime + fadeTime * 3);

// test

// Fireworks Effect
function launchFirework(x, y) {
    const container = document.getElementById('fireworks-container');
    const count = 20;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 80 + 40;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--x', `${dx}px`);
        particle.style.setProperty('--y', `${dy}px`);

        container.appendChild(particle);

        setTimeout(() => container.removeChild(particle), 1000);
    }
}

// Lanza automáticamente fuegos cada 3 segundos
setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    launchFirework(x, y);
}, 3000);

// Fuegos artificiales al hacer clic
document.addEventListener('click', (e) => {
    launchFirework(e.clientX, e.clientY);
});

// Partículas flotantes constantes (atmósfera roja)
function spawnFloatingParticle() {
    const particle = document.createElement('div');
    particle.classList.add('floating-particle');

    // Posición aleatoria
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = (Math.random() * window.innerHeight + 100) + 'px';

    // Velocidad aleatoria
    const duration = Math.random() * 5 + 3; // entre 3 y 8 segundos
    particle.style.animationDuration = `${duration}s`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Crear muchas partículas constantemente
setInterval(spawnFloatingParticle, 150); // Cada 150 ms (ajusta si quieres más o menos)