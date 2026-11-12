/* ==========================================================================
   TESTIMONIAL FUNCTIONALITY - JAVASCRIPT
   Fitur: Rating interaktif, localStorage CRUD, render dinamis
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. STORAGE KEY & DATA MODEL
// --------------------------------------------------------------------------
const TESTIMONIALS_STORAGE_KEY = 'portfolio_testimonials';

// Testimonial data structure:
// {
//   id: string (timestamp),
//   name: string,
//   role: string,
//   rating: number (1-5),
//   message: string,
//   date: string (ISO format)
// }

// --------------------------------------------------------------------------
// 2. DOM ELEMENT REFERENCES
// --------------------------------------------------------------------------
const testimonialForm = document.getElementById('testimonialForm');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('testimonialRating');
const testimonialsList = document.getElementById('testimonialsList');
const testimonialCount = document.getElementById('testimonialCount');

// Modal elements
const floatingBtn = document.getElementById('floatingTestimonialBtn');
const testimonialModal = document.getElementById('testimonialModal');
const modalOverlay = document.getElementById('testimonialModalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// --------------------------------------------------------------------------
// 3. INITIALIZE ON PAGE LOAD
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  initializeStarRating();
  initializeTestimonialForm();
  initializeModalHandlers();
  renderTestimonials();
});

// --------------------------------------------------------------------------
// 4. MODAL OPEN/CLOSE HANDLERS
// --------------------------------------------------------------------------
function initializeModalHandlers() {
  // Open modal when floating button is clicked
  if (floatingBtn) {
    floatingBtn.addEventListener('click', openModal);
  }

  // Close modal when close button is clicked
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && testimonialModal && testimonialModal.classList.contains('show')) {
      closeModal();
    }
  });
}

function openModal() {
  if (!testimonialModal) return;

  testimonialModal.classList.remove('hiding');
  testimonialModal.classList.add('show');
  testimonialModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Focus first input
  setTimeout(() => {
    const firstInput = document.getElementById('testimonialName');
    if (firstInput) firstInput.focus();
  }, 300);
}

function closeModal() {
  if (!testimonialModal) return;

  testimonialModal.classList.add('hiding');
  testimonialModal.classList.remove('show');
  
  setTimeout(() => {
    testimonialModal.style.display = 'none';
    testimonialModal.classList.remove('hiding');
    testimonialModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }, 300);
}

// --------------------------------------------------------------------------
// 4. STAR RATING INTERACTIVE LOGIC
// --------------------------------------------------------------------------
function initializeStarRating() {
  const stars = starRating.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    // Hover effect
    star.addEventListener('mouseenter', function() {
      highlightStars(index + 1);
    });
    
    // Click to select rating
    star.addEventListener('click', function() {
      const rating = parseInt(star.getAttribute('data-rating'));
      ratingInput.value = rating;
      
      // Remove all active classes
      stars.forEach(s => s.classList.remove('active'));
      
      // Add active class to selected stars
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add('active');
      }
    });
  });
  
  // Reset on mouse leave
  starRating.addEventListener('mouseleave', function() {
    const currentRating = parseInt(ratingInput.value) || 0;
    highlightStars(currentRating);
  });
}

function highlightStars(count) {
  const stars = starRating.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < count) {
      star.style.color = '#fbbf24';
    } else {
      star.style.color = 'var(--border-light)';
    }
  });
}

// --------------------------------------------------------------------------
// 5. FORM SUBMISSION HANDLER
// --------------------------------------------------------------------------
function initializeTestimonialForm() {
  testimonialForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('testimonialName').value.trim();
    const role = document.getElementById('testimonialRole').value.trim();
    const rating = parseInt(ratingInput.value);
    const message = document.getElementById('testimonialMessage').value.trim();
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      showToast('Mohon berikan rating dengan mengklik bintang (1-5)!', 'error');
      return;
    }
    
    // Validate message
    if (message.length < 10) {
      showToast('Testimoni minimal 10 karakter!', 'error');
      return;
    }
    
    // Create testimonial object
    const testimonial = {
      id: Date.now().toString(),
      name: name,
      role: role || 'Pengguna',
      rating: rating,
      message: message,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    saveTestimonial(testimonial);
    
    // Show success feedback
    showToast('Terima kasih! Testimoni Anda telah tersimpan.', 'success');
    
    // Reset form
    testimonialForm.reset();
    ratingInput.value = '0';
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(s => s.classList.remove('active'));
    highlightStars(0);
    
    // Close modal after short delay
    setTimeout(() => {
      closeModal();
    }, 1500);
    
    // Re-render testimonials
    renderTestimonials();
  });
}

// --------------------------------------------------------------------------
// 6. LOCALSTORAGE OPERATIONS (CRUD)
// --------------------------------------------------------------------------

// Get all testimonials from localStorage
function getTestimonials() {
  const data = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save new testimonial
function saveTestimonial(testimonial) {
  const testimonials = getTestimonials();
  testimonials.unshift(testimonial); // Add to beginning of array
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
}

// Delete testimonial by id
function deleteTestimonial(id) {
  let testimonials = getTestimonials();
  testimonials = testimonials.filter(t => t.id !== id);
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
  
  showToast('Testimoni telah dihapus.', 'info');
  renderTestimonials();
}

// --------------------------------------------------------------------------
// 7. RENDER TESTIMONIALS TO UI
// --------------------------------------------------------------------------
function renderTestimonials() {
  const testimonials = getTestimonials();
  
  // Update count
  testimonialCount.textContent = testimonials.length;
  
  // Clear current list
  testimonialsList.innerHTML = '';
  
  // Show empty state if no testimonials
  if (testimonials.length === 0) {
    testimonialsList.innerHTML = `
      <div class="empty-testimonials">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>Belum ada testimoni. Jadilah yang pertama memberikan ulasan!</p>
      </div>
    `;
    return;
  }
  
  // Render each testimonial card
  testimonials.forEach(testimonial => {
    const card = createTestimonialCard(testimonial);
    testimonialsList.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// 8. CREATE TESTIMONIAL CARD ELEMENT
// --------------------------------------------------------------------------
function createTestimonialCard(testimonial) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.setAttribute('data-id', testimonial.id);
  
  // Format date
  const formattedDate = formatDate(testimonial.date);
  
  // Generate star rating display
  const starsHTML = generateStarRating(testimonial.rating);
  
  // Build card HTML
  card.innerHTML = `
    <div class="testimonial-card-header">
      <div class="testimonial-author">
        <div class="testimonial-author-name">${escapeHtml(testimonial.name)}</div>
        ${testimonial.role ? `<div class="testimonial-author-role">${escapeHtml(testimonial.role)}</div>` : ''}
      </div>
      <div class="testimonial-rating">
        ${starsHTML}
      </div>
    </div>
    
    <div class="testimonial-message">
      ${escapeHtml(testimonial.message)}
    </div>
    
    <div class="testimonial-card-footer">
      <div class="testimonial-date">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${formattedDate}</span>
      </div>
      <button type="button" class="btn-delete-testimonial" data-id="${testimonial.id}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Hapus</span>
      </button>
    </div>
  `;
  
  // Attach delete event listener
  const deleteBtn = card.querySelector('.btn-delete-testimonial');
  deleteBtn.addEventListener('click', function() {
    if (confirm('Hapus testimoni ini?')) {
      deleteTestimonial(testimonial.id);
    }
  });
  
  return card;
}

// --------------------------------------------------------------------------
// 9. UTILITY FUNCTIONS
// --------------------------------------------------------------------------

// Generate star rating HTML
function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star-display">★</span>';
    } else {
      stars += '<span class="star-display" style="color: var(--border-light);">★</span>';
    }
  }
  return stars;
}

// Format date to readable format
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hari ini';
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --------------------------------------------------------------------------
// 10. TOAST NOTIFICATION
// --------------------------------------------------------------------------
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.testimonial-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'testimonial-toast';
  
  // Set color based on type
  if (type === 'error') {
    toast.style.backgroundColor = '#ef4444';
  } else if (type === 'info') {
    toast.style.backgroundColor = '#3b82f6';
  }
  
  // Icon SVG
  const icon = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
         <polyline points="22 4 12 14.01 9 11.01"></polyline>
       </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <circle cx="12" cy="12" r="10"></circle>
         <line x1="12" y1="8" x2="12" y2="12"></line>
         <line x1="12" y1="16" x2="12.01" y2="16"></line>
       </svg>`;
  
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
}

// --------------------------------------------------------------------------
// 11. EXPORT FOR DEBUGGING (OPTIONAL)
// --------------------------------------------------------------------------
window.testimonialDebug = {
  getAll: getTestimonials,
  clear: function() {
    localStorage.removeItem(TESTIMONIALS_STORAGE_KEY);
    renderTestimonials();
    console.log('All testimonials cleared');
  },
  add: function(name, role, rating, message) {
    const testimonial = {
      id: Date.now().toString(),
      name: name,
      role: role || 'Pengguna',
      rating: rating,
      message: message,
      date: new Date().toISOString()
    };
    saveTestimonial(testimonial);
    renderTestimonials();
    console.log('Testimonial added:', testimonial);
  }
};