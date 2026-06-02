
// ===== Navigation Management =====
function goToPage(page) {
   window.location.href = page;
}

console.log('main is firing!');

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Track whether the mobile menu is currently open or closed
let isMenuOpen = false;

// Toggle mobile menu
function toggleMobileMenu() {
   // Switch the menu state (true becomes false, false becomes true)
   isMenuOpen = !isMenuOpen;
   
   // Determine icon path based on current page
   const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
   const closeIcon = isIndexPage ? 'close.svg' : '../images/close.svg';
   const menuIcon = isIndexPage ? 'menu.svg' : '../images/menu.svg';
   
   if (isMenuOpen) {
      // OPEN the menu
      mobileMenu.classList.add('active');           // Show the menu
      menuOverlay.classList.add('active');          // Show the overlay behind it
      document.body.style.overflow = 'hidden';      // Prevent scrolling on page
      hamburgerIcon.src = closeIcon;                // Change icon to X
   } else {
      // CLOSE the menu
      mobileMenu.classList.remove('active');        // Hide the menu
      menuOverlay.classList.remove('active');       // Hide the overlay
      document.body.style.overflow = 'auto';        // Allow scrolling again
      hamburgerIcon.src = menuIcon;                 // Change icon back to hamburger
   }
}








// ===== Mobile Menu Event Listeners =====

// Add click listener to hamburger button - opens/closes menu
if (hamburger) {
   hamburger.addEventListener('click', toggleMobileMenu);
}

// Add click listener to close button inside menu
if (closeMenu) {
   closeMenu.addEventListener('click', toggleMobileMenu);
}

// Close menu when user clicks on any navigation link
// This makes the menu disappear after selecting a link
mobileNavLinks.forEach(link => {
   link.addEventListener('click', () => {
      // Only close if menu is currently open
      if (isMenuOpen) {
         toggleMobileMenu();
      }
   });
});

// Close mobile menu when clicking on overlay
if (menuOverlay) {
   menuOverlay.addEventListener('click', () => {
      // Only close if menu is currently open
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

// Track which image is currently being shown in the lightbox
let currentImageIndex = 0;
const totalImages = galleryItems.length;

// Function: Open the lightbox and display a specific image
// Parameters: index = which image to show (0, 1, 2, etc.)
function openLightbox(index) {
   // Exit if lightbox elements don't exist
   if (!lightbox || !lightboxImage) return;
   
   // Update which image we're on
   currentImageIndex = index;
   
   // Get the image source and description from the gallery item
   const imageSrc = galleryItems[index].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[index].querySelector('.gallery-image').alt;
   
   // Set the lightbox to show this image
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
   
   // Make the lightbox visible and prevent page scrolling
   lightbox.classList.add('active');
   document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
   // Exit if lightbox doesn't exist
   if (!lightbox) return;
   
   // Hide the lightbox
   lightbox.classList.remove('active');
   
   // Allow scrolling on the page again
   document.body.style.overflow = 'auto';
}

// Navigate to next image
function showNextImage() {
   if (!lightboxImage) return;
   
   // Move to next image (wraps around using modulo operator %)
   currentImageIndex = (currentImageIndex + 1) % totalImages;
   
   // Get the new image source and description
   const imageSrc = galleryItems[currentImageIndex].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[currentImageIndex].querySelector('.gallery-image').alt;
   
   // Update the displayed image
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
}

// Navigate to previous image
function showPrevImage() {
   if (!lightboxImage) return;
   
   // Move to previous image (wraps around using modulo operator %)
   // We add totalImages before subtracting to avoid negative numbers
   currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
   
   // Get the new image source and description
   const imageSrc = galleryItems[currentImageIndex].querySelector('.gallery-image').src;
   const imageAlt = galleryItems[currentImageIndex].querySelector('.gallery-image').alt;
   
   // Update the displayed image
   lightboxImage.src = imageSrc;
   lightboxImage.alt = imageAlt;
}









// ===== Lightbox Event Listeners =====

// Open lightbox when clicking on any gallery item
if (galleryItems.length > 0) {
   galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
   });
}

// Close lightbox when clicking the close button
if (closeBtn) {
   closeBtn.addEventListener('click', closeLightbox);
}

// Show previous image when clicking the left arrow
if (prevBtn) {
   prevBtn.addEventListener('click', showPrevImage);
}

// Show next image when clicking the right arrow
if (nextBtn) {
   nextBtn.addEventListener('click', showNextImage);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
   // Only listen if lightbox is open
   if (!lightbox || !lightbox.classList.contains('active')) return;
   
   if (e.key === 'ArrowRight') {
      // Right arrow = next image
      showNextImage();
   } else if (e.key === 'ArrowLeft') {
      // Left arrow = previous image
      showPrevImage();
   } else if (e.key === 'Escape') {
      // Escape key = close lightbox
      closeLightbox();
   }
});

// Close lightbox when clicking on the overlay (outside the image)
if (lightbox) {
   lightbox.addEventListener('click', (e) => {
      // Check if click was on the background, not the image
      if (e.target === lightbox) {
         closeLightbox();
      }
   });
}



// ===== Swipe Gesture Support =====
if (lightbox) {
   // Variables to track where a swipe started and ended
   let touchStartX = 0;
   let touchEndX = 0;
   let touchStartY = 0;
   let touchEndY = 0;

   // Function: Detect and handle swipe gestures
   function handleSwipe() {
      const swipeThreshold = 50;           // Minimum distance to count as a swipe (pixels)
      const verticalThreshold = 100;       // Maximum vertical movement allowed for horizontal swipe
      
      // Calculate how far the swipe moved
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Check if swipe is more horizontal than vertical (to avoid triggering on scrolls)
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

   // Detect when user puts their finger on the screen
   lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
   }, false);

   // Detect when user lifts their finger from the screen
   lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      // Process the swipe gesture
      handleSwipe();
   }, false);
}



// ===== Firebase Configuration =====
// Configuration is loaded from firebaseConfig.js

// Initialize Firebase only when available
let app, db;

// Function: Initialize Firebase
// This sets up the connection to the database
function initializeFirebase() {
  // Exit if already initialized
  if (app) return true;
  
  try {
    // Check if Firebase library is loaded
    if (typeof firebase === 'undefined') {
      return false;
    }
    
    // Initialize Firebase with config settings
    app = firebase.initializeApp(firebaseConfig);
    
    // Get database connection
    db = firebase.firestore(app);
    
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}








// ========================================
// CABINET COLOR SELECTION SECTION
// Manages selection and display of colors
// ========================================

// ===== Constants =====
// Document names and collection names in Firebase
const SELECTED_COLORS_DOC = 'selectedColors';   // Document that stores selected colors
const COLORS_COLLECTION = 'colors';             // Collection where colors are stored
const SELECTION_KEY = 'gitu11';                 // Passkey required to add/remove colors
const SESSION_PASSKEY_STORAGE = 'sessionPasskey'; // Where to store verified passkey

// ===== Page Elements =====
// Get references to HTML elements we'll need to interact with
const keyModal = document.getElementById('keyModal');
const keyInput = document.getElementById('keyInput');
const keyModalConfirm = document.getElementById('keyModalConfirm');
const keyModalCancel = document.getElementById('keyModalCancel');
const materialsContainer = document.getElementById('materialsContainer');
const selectedMaterialsContainer = document.getElementById('selectedMaterialsContainer');
const toast = document.getElementById('toast');

// ===== Variables to Track State =====
let currentAction = null;              // What action we're trying to do (add or remove)
let currentMaterialData = null;        // Data about the color being acted on
let allMaterials = [];                 // List of all available colors from data.json
let displayedItemIds = new Set();      // Colors already shown (prevents duplicates)








// ===== Firebase Database Functions =====
// These functions read and write colors to the database

// Function: Get all selected colors from the database
async function getSelectedColors() {
   // Exit if database isn't connected
   if (!db) {
      throw new Error('Database connection not available');
   }
   
   try {
      // Get the document that stores all selected colors
      const doc = await db.collection(COLORS_COLLECTION).doc(SELECTED_COLORS_DOC).get();
      
      // Return the colors if document exists, otherwise return empty array
      return doc.exists ? (doc.data().items || []) : [];
   } catch (error) {
      console.error('Error fetching selected colors:', error);
      throw new Error('Failed to load selected colors from database');
   }
}

// Function: Add a new color to the database
async function addSelectedColor(materialData) {
   // Exit if database isn't connected
   if (!db) {
      throw new Error('Database connection not available');
   }
   
   try {
      // Get all currently selected colors
      const selected = await getSelectedColors();
      
      // Check if this color already exists to avoid duplicates
      if (selected.some(item => item.id === materialData.id)) {
         return; // Already exists, no need to add again
      }
      
      // Add the new color to the list
      selected.push(materialData);
      
      // Save the updated list back to the database
      await db.collection(COLORS_COLLECTION).doc(SELECTED_COLORS_DOC).set({ items: selected });
      console.log('✅ Added to database:', materialData.name);
   } catch (error) {
      console.error('❌ Error adding color:', error);
      throw new Error('Failed to add color to database');
   }
}

// Function: Remove a color from the database
async function removeSelectedColor(materialId) {
   // Exit if database isn't connected
   if (!db) {
      throw new Error('Database connection not available');
   }
   
   try {
      // Get all currently selected colors
      const selected = await getSelectedColors();
      
      // Filter out the color we want to remove
      const filtered = selected.filter(item => item.id !== materialId);
      
      // Save the updated list (without the removed color) back to the database
      await db.collection(COLORS_COLLECTION).doc(SELECTED_COLORS_DOC).set({ items: filtered });
      console.log('Removed from database:', materialId);
   } catch (error) {
      console.error('❌ Error removing color:', error);
      throw new Error('Failed to remove color from database');
   }
}






// ===== User Notifications =====

// Function: Show a temporary notification message to the user
// Parameters: message = text to show, type = 'success' or 'error'
function showToast(message, type = 'success') {
   // Exit if toast element doesn't exist
   if (!toast) return;
   
   // Set the message text
   toast.textContent = message;
   
   // Set the style (changes color based on success/error)
   toast.className = `toast toast-${type}`;
   
   // Make the toast visible
   toast.style.display = 'block';
   
   // Auto-hide after 3 seconds
   setTimeout(() => {
      toast.style.display = 'none';
   }, 3000);
}









// ===== Passkey Modal Functions =====
// These functions manage the modal that asks for a passkey

// Function: Open the passkey modal or skip it if already verified
// Parameters: action = 'add' or 'remove', materialData = color data
async function openKeyModal(action, materialData) {
   // Exit if modal doesn't exist
   if (!keyModal) return;
   
   // Check if passkey already verified for this session
   const storedPasskey = sessionStorage.getItem(SESSION_PASSKEY_STORAGE);
   if (storedPasskey === SELECTION_KEY) {
      // Passkey already verified - skip modal and proceed immediately
      currentAction = action;
      currentMaterialData = materialData;
      await proceedWithAction();
      return;
   }
   
   // Show modal for passkey entry
   currentAction = action;
   currentMaterialData = materialData;
   keyInput.value = '';              // Clear previous input
   keyInput.focus();                 // Focus on input field
   keyModal.style.display = 'flex';  // Make modal visible
   document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function: Close the passkey modal
function closeKeyModal() {
   // Exit if modal doesn't exist
   if (!keyModal) return;
   
   // Hide the modal
   keyModal.style.display = 'none';
   
   // Allow scrolling again
   document.body.style.overflow = 'auto';
   
   // Clear the stored action and data
   currentAction = null;
   currentMaterialData = null;
   keyInput.value = '';
}

// Function: Check if passkey is correct and proceed if it is
async function verifyKeyAndProceed() {
   // Check if the entered key matches the correct key
   if (keyInput.value !== SELECTION_KEY) {
      // Wrong key - show error and clear input
      showToast('Incorrect key', 'error');
      keyInput.value = '';
      return;
   }
   
   // Store passkey in session storage for this session
   sessionStorage.setItem(SESSION_PASSKEY_STORAGE, SELECTION_KEY);
   
   // Perform the action (add or remove)
   await proceedWithAction();
   
   // Close the modal
   closeKeyModal();
}

// Function: Perform the current action (add or remove a color)
async function proceedWithAction() {
   if (currentAction === 'add') {
      // Add the color
      await addMaterialToSelected(currentMaterialData);
   } else if (currentAction === 'remove') {
      // Remove the color
      await removeMaterialFromSelected(currentMaterialData);
   }
   
   // Clear the action and data
   currentAction = null;
   currentMaterialData = null;
}

// ===== Color Selection Functions =====

// Function: Add a color to the "Selected" section
async function addMaterialToSelected(materialData) {
   // Exit if container doesn't exist
   if (!selectedMaterialsContainer) return;
   
   // Check if this color already appears in selected section
   if (displayedItemIds.has(materialData.id)) {
      showToast('Already added!', 'error');
      return;
   }
   
   // Mark this color as displayed (prevents double-clicking)
   displayedItemIds.add(materialData.id);
   
   // Remove the "no colors selected" message if it exists
   const emptyMessage = selectedMaterialsContainer.querySelector('.empty-state-message');
   if (emptyMessage) {
      emptyMessage.remove();
   }
   
   // Create HTML for the selected color item
   const selectedMaterialCont = document.createElement('div');
   selectedMaterialCont.className = 'selected-material-cont';
   selectedMaterialCont.dataset.materialId = materialData.id;
   
   selectedMaterialCont.innerHTML = `
      <img src="${materialData.image}" alt="${materialData.name}" class="selected-material-image">
      <div class="selected-material-name-cont">
         <span class="selected-material-name">${materialData.name}</span>
         <button class="material-remove-btn" aria-label="Remove ${materialData.name}">Remove</button>
      </div>
   `;
   
   // Add click listener to remove button
   const removeBtn = selectedMaterialCont.querySelector('.material-remove-btn');
   removeBtn.addEventListener('click', () => {
      openKeyModal('remove', materialData);
   });
   
   // Add the color to the page immediately (optimistic update)
   selectedMaterialsContainer.appendChild(selectedMaterialCont);
   showToast('Added to selected colours', 'success');
   
   // Save to database in the background (user sees it immediately even if save fails)
   addSelectedColor(materialData).catch(error => {
      console.error('Error persisting to Firebase:', error);
   });
}

// Function: Remove a color from the "Selected" section
async function removeMaterialFromSelected(materialData) {
   // Exit if container doesn't exist
   if (!selectedMaterialsContainer) return;
   
   // Remove from our tracking list
   displayedItemIds.delete(materialData.id);
   
   // Remove from UI immediately (optimistic update)
   const element = selectedMaterialsContainer.querySelector(`[data-material-id="${materialData.id}"]`);
   if (element) {
      element.remove();
   }
   
   // Show "no colors selected" message if section is now empty
   const items = selectedMaterialsContainer.querySelectorAll('.selected-material-cont');
   if (items.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-state-message';
      emptyMessage.textContent = 'No cabinet colors selected yet';
      selectedMaterialsContainer.appendChild(emptyMessage);
   }
   
   showToast('Removed from selected colours', 'success');
   
   // Remove from database in the background (user sees it removed immediately even if delete fails)
   removeSelectedColor(materialData.id).catch(error => {
      console.error('Error removing from Firebase:', error);
   });
}

// ===== Color Display Functions =====

// Function: Load all selected colors from database and display them
async function renderSelectedMaterials() {
   // Exit if container doesn't exist
   if (!selectedMaterialsContainer) return;
   
   try {
      // Get all selected colors from database
      const selected = await getSelectedColors();
      
      // Clear the container
      selectedMaterialsContainer.innerHTML = '';
      displayedItemIds.clear();
      
      // Show "no colors selected" message if list is empty
      if (selected.length === 0) {
         const emptyMessage = document.createElement('p');
         emptyMessage.className = 'empty-state-message';
         emptyMessage.textContent = 'No cabinet colors selected yet';
         selectedMaterialsContainer.appendChild(emptyMessage);
         return;
      }
      
      // Display each selected color
      selected.forEach(material => {
         // Mark as displayed to prevent duplicates
         displayedItemIds.add(material.id);
         
         // Create HTML for the selected color
         const selectedMaterialCont = document.createElement('div');
         selectedMaterialCont.className = 'selected-material-cont';
         selectedMaterialCont.dataset.materialId = material.id;
         
         selectedMaterialCont.innerHTML = `
            <img src="${material.image}" alt="${material.name}" class="selected-material-image">
            <div class="selected-material-name-cont">
               <span class="selected-material-name">${material.name}</span>
               <button class="material-remove-btn" aria-label="Remove ${material.name}">Remove</button>
            </div>
         `;
         
         // Add click listener to remove button
         const removeBtn = selectedMaterialCont.querySelector('.material-remove-btn');
         removeBtn.addEventListener('click', () => {
            openKeyModal('remove', material);
         });
         
         // Add to page
         selectedMaterialsContainer.appendChild(selectedMaterialCont);
      });
   } catch (error) {
      console.error('Error rendering selected materials:', error);
      
      // Show error message if something goes wrong
      selectedMaterialsContainer.innerHTML = '';
      const errorMessage = document.createElement('p');
      errorMessage.className = 'empty-state-message';
      errorMessage.textContent = 'Unable to load selected colors. Please check your connection.';
      selectedMaterialsContainer.appendChild(errorMessage);
   }
}

// Load and render materials from JSON
async function loadMaterials() {
   // Get reference to loading spinner element
   const colorLoader = document.getElementById('colorLoader');
   
   try {
      // Load the JSON file
      const response = await fetch('../data.json');
      allMaterials = await response.json();
      
      // Display all available colors
      renderMaterials();
      
      // Hide the loader after rendering
      if (colorLoader) {
         colorLoader.classList.add('hidden');
      }
      
      // Render selected materials from Firebase
      await renderSelectedMaterials();
   } catch (error) {
      console.error('Error loading materials:', error);
      showToast('Error loading materials', 'error');
      
      // Hide the loader on error
      if (colorLoader) {
         colorLoader.classList.add('hidden');
      }
   }
}

// Function: Display all available colors on the page
function renderMaterials() {
   // Exit if container doesn't exist
   if (!materialsContainer) return;
   
   // Clear the container
   materialsContainer.innerHTML = '';
   
   // Create HTML for each available color
   allMaterials.forEach(material => {
      const materialCont = document.createElement('div');
      materialCont.className = 'material-cont';
      materialCont.dataset.materialId = material.id;
      
      materialCont.innerHTML = `
         <img src="${material.image}" alt="${material.name}" class="material-image">
         <div class="material-name-cont">
            <span class="material-name">${material.name}</span>
            <button class="material-add-btn" data-material-id="${material.id}" aria-label="Select ${material.name}">
               Select
            </button>
         </div>
      `;
      
      // Add click listener to add button
      const addBtn = materialCont.querySelector('.material-add-btn');
      addBtn.addEventListener('click', () => {
         openKeyModal('add', material);
      });
      
      // Add to page
      materialsContainer.appendChild(materialCont);
   });
}

// ===== Page Initialization =====

// Function: Initialize the color selection page
// This runs when the page is first loaded
async function initColourSelection() {
   // Try to initialize Firebase with retries
   let attempts = 0;
   const maxAttempts = 20;
   
   // Keep trying to initialize Firebase
   while (!db && attempts < maxAttempts) {
      if (initializeFirebase()) {
         console.log('Firebase initialized successfully');
         break;
      }
      attempts++;
      // Wait 300ms before trying again
      await new Promise(r => setTimeout(r, 300));
   }
   
   // Show error if Firebase failed to initialize after all attempts
   if (!db) {
      console.error('Firebase failed to initialize. The colour selection feature requires a database connection.');
      showToast('Database connection failed. Please refresh the page.', 'error');
   }
   
   // Load and render materials (will fail with error message if Firebase not ready)
   await loadMaterials();
}

// ===== Passkey Modal Event Listeners =====

// Confirm button - verify key and proceed
if (keyModalConfirm) {
   keyModalConfirm.addEventListener('click', verifyKeyAndProceed);
}

// Cancel button - close modal
if (keyModalCancel) {
   keyModalCancel.addEventListener('click', closeKeyModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && keyModal && keyModal.style.display !== 'none') {
      closeKeyModal();
   }
});

// Allow Enter key to confirm in key input
if (keyInput) {
   keyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
         verifyKeyAndProceed();
      }
   });
}

// Close modal when clicking outside
if (keyModal) {
   keyModal.addEventListener('click', (e) => {
      // Only close if clicking on the background, not the modal content
      if (e.target === keyModal) {
         closeKeyModal();
      }
   });
}

// Initialize when DOM is ready
function initWhenReady() {
   if (document.readyState === 'loading') {
      // Page is still loading - wait for it to finish
      document.addEventListener('DOMContentLoaded', () => {
         setTimeout(initColourSelection, 1000); // Increased from 500ms to 1000ms
      });
   } else {
      // Page is already loaded - initialize now
      // Wait 1 second then initialize (gives Firebase library time to load)
      setTimeout(initColourSelection, 1000);
   }
}

// Start the initialization process
initWhenReady();
