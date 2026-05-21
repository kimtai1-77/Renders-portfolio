// ===== Navigation Management =====
function goToPage(page) {
   window.location.href = page;
}

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

let isMenuOpen = false;

// Toggle mobile menu
function toggleMobileMenu() {
   isMenuOpen = !isMenuOpen;
   
   if (isMenuOpen) {
      mobileMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Change icon to close
      hamburgerIcon.src = 'images/close.svg';
   } else {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
      // Change icon back to menu
      hamburgerIcon.src = 'images/menu.svg';
   }
}

// Open mobile menu
if (hamburger) {
   hamburger.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu
if (closeMenu) {
   closeMenu.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a nav link
mobileNavLinks.forEach(link => {
   link.addEventListener('click', () => {
      if (isMenuOpen) {
         toggleMobileMenu();
      }
   });
});

// Close mobile menu when clicking on overlay
if (menuOverlay) {
   menuOverlay.addEventListener('click', () => {
      if (isMenuOpen) {
         toggleMobileMenu();
      }
   });
}


// ===== Lightbox Management =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const galleryItems = document.querySelectorAll('.gallery-item');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImageIndex = 0;
const totalImages = galleryItems.length;

// Open lightbox
function openLightbox(index) {
   if (!lightbox || !lightboxImage) return;
   
   currentImageIndex = index;
   const imageSrc = galleryItems[index].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[index].querySelector('.gallery-image').alt;
   
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
   lightbox.classList.add('active');
   document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
   if (!lightbox) return;
   lightbox.classList.remove('active');
   document.body.style.overflow = 'auto';
}

// Navigate to next image
function showNextImage() {
   if (!lightboxImage) return;
   currentImageIndex = (currentImageIndex + 1) % totalImages;
   const imageSrc = galleryItems[currentImageIndex].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[currentImageIndex].querySelector('.gallery-image').alt;
   
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
}

// Navigate to previous image
function showPrevImage() {
   if (!lightboxImage) return;
   currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
   const imageSrc = galleryItems[currentImageIndex].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[currentImageIndex].querySelector('.gallery-image').alt;
   
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
}

// Event Listeners
if (galleryItems.length > 0) {
   galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
   });
}

if (closeBtn) {
   closeBtn.addEventListener('click', closeLightbox);
}
if (prevBtn) {
   prevBtn.addEventListener('click', showPrevImage);
}
if (nextBtn) {
   nextBtn.addEventListener('click', showNextImage);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
   if (!lightbox || !lightbox.classList.contains('active')) return;
   
   if (e.key === 'ArrowRight') {
      showNextImage();
   } else if (e.key === 'ArrowLeft') {
      showPrevImage();
   } else if (e.key === 'Escape') {
      closeLightbox();
   }
});

// Close lightbox when clicking on the overlay (outside the image)
if (lightbox) {
   lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
         closeLightbox();
      }
   });
}

// ===== Swipe Gesture Support =====
if (lightbox) {
   let touchStartX = 0;
   let touchEndX = 0;
   let touchStartY = 0;
   let touchEndY = 0;

   function handleSwipe() {
      const swipeThreshold = 50;
      const verticalThreshold = 100;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Check if swipe is more horizontal than vertical
      if (Math.abs(deltaX) > swipeThreshold && deltaY < verticalThreshold) {
         if (deltaX > 0) {
            // Swiped right - show previous image
            showPrevImage();
         } else {
            // Swiped left - show next image
            showNextImage();
         }
      }
   }

   lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
   }, false);

   lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
   }, false);
}
