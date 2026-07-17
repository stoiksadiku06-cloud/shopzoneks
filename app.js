document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let cart = JSON.parse(localStorage.getItem('shopzone_cart')) || [];
  let currentSlide = 0;
  let activeCategory = 'Të gjitha';
  let searchQuery = '';
  
  // --- SELECTORS ---
  const sliderWrapper = document.getElementById('featured-slider-wrapper');
  const sliderDotsContainer = document.getElementById('slider-dots-container');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  
  const productsGrid = document.getElementById('products-grid');
  const filterTabsContainer = document.getElementById('filter-tabs-container');
  const searchInput = document.getElementById('search-input');
  
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  const toast = document.getElementById('toast-notification');

  // --- WHATSAPP CONFIG ---
  const WHATSAPP_NUMBER = '38345657126'; // User's requested phone number (+38345657126)

  // ==========================================
  // 1. FEATURED PRODUCTS SWIPE SLIDER
  // ==========================================
  const featuredProducts = products.filter(p => p.featured);
  
  function initSlider() {
    sliderWrapper.innerHTML = '';
    sliderDotsContainer.innerHTML = '';
    
    featuredProducts.forEach((product, index) => {
      // Create Slide
      const slide = document.createElement('div');
      slide.classList.add('slide');
      slide.innerHTML = `
        <div class="slide-image-container">
          <img class="slide-image" src="${product.image}" alt="${product.name}">
        </div>
        <div class="slide-content">
          <span class="slide-badge">E Kërkuar</span>
          <h3 class="slide-title">${product.name}</h3>
          <p class="slide-description">${product.description}</p>
          <div class="slide-price">€${product.price}</div>
          <button class="slide-action-btn" data-id="${product.id}">Shto në Shportë</button>
        </div>
      `;
      sliderWrapper.appendChild(slide);
      
      // Create Dot Indicator
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      sliderDotsContainer.appendChild(dot);
    });

    // Add event listeners for slide buttons
    sliderWrapper.querySelectorAll('.slide-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
      });
    });

    updateSliderPosition();
    setupSwipeGestures();
  }

  function updateSliderPosition() {
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % featuredProducts.length;
    updateSliderPosition();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + featuredProducts.length) % featuredProducts.length;
    updateSliderPosition();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSliderPosition();
  }

  // Swipe gesture support (mobile)
  let startX = 0;
  let isDragging = false;
  
  function setupSwipeGestures() {
    sliderWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diffX = e.touches[0].clientX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        isDragging = false; // Trigger once per swipe
      }
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Slide Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  // Auto slide interval (5 seconds)
  let slideInterval = setInterval(nextSlide, 5000);
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
  }

  // ==========================================
  // 2. PRODUCT CATALOG & FILTERS
  // ==========================================
  function initCatalog() {
    // Generate Category Tabs dynamically
    const categories = ['Të gjitha', ...new Set(products.map(p => p.category))];
    filterTabsContainer.innerHTML = '';
    
    categories.forEach(category => {
      const tab = document.createElement('button');
      tab.classList.add('filter-tab');
      if (category === activeCategory) tab.classList.add('active');
      tab.textContent = category;
      tab.addEventListener('click', () => {
        activeCategory = category;
        // Update tab styles
        filterTabsContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderProducts();
      });
      filterTabsContainer.appendChild(tab);
    });

    renderProducts();
  }

  function renderProducts() {
    productsGrid.innerHTML = '';
    
    const filtered = products.filter(product => {
      const matchesCategory = activeCategory === 'Të gjitha' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem;">Nuk u gjet asnjë produkt për këtë kërkim.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <div class="product-card-img-wrapper">
          <img class="product-card-img" src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${product.category}</span>
          <h4 class="product-card-title">${product.name}</h4>
          <p class="product-card-desc">${product.description}</p>
          <div class="product-card-footer">
            <span class="product-card-price">€${product.price}</span>
            <button class="add-to-cart-btn" data-id="${product.id}">Shto</button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Listeners for cards
    productsGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
      });
    });
  }

  // Search input listener
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // ==========================================
  // 3. SHOPPING CART LOGIC
  // ==========================================
  function updateCartBadge() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeCount.textContent = totalCount;
    
    // Scale animation on cart button
    openCartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      openCartBtn.style.transform = 'scale(1)';
    }, 200);
  }

  function saveCart() {
    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    showToast(`"${product.name}" u shtua në shportë!`);
    saveCart();
  }

  function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
  }

  function removeFromCart(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(item => item.id !== id);
    if (item) {
      showToast(`"${item.name}" u hoq nga shporta.`);
    }
    saveCart();
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <div class="empty-cart-icon">🛒</div>
          <p>Shporta juaj është e zbrazët</p>
        </div>
      `;
      cartTotalPrice.textContent = '€0.00';
      return;
    }

    let subtotal = 0;

    cart.forEach(item => {
      const totalItemPrice = item.price * item.quantity;
      subtotal += totalItemPrice;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h5 class="cart-item-title">${item.name}</h5>
          <span class="cart-item-price">€${item.price}</span>
          <div class="cart-item-qty">
            <button class="qty-btn minus-qty" data-id="${item.id}">-</button>
            <span style="font-weight:600; font-size: 0.9rem;">${item.quantity}</span>
            <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3h11V2h-11v1z"/>
          </svg>
        </button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalPrice.textContent = `€${subtotal.toFixed(2)}`;

    // Hook up +/- buttons and remove buttons
    cartItemsContainer.querySelectorAll('.minus-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        changeQuantity(id, -1);
      });
    });

    cartItemsContainer.querySelectorAll('.plus-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        changeQuantity(id, 1);
      });
    });

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        removeFromCart(id);
      });
    });
  }

  // Drawer Toggle Events
  openCartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  });

  function closeDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  closeCartBtn.addEventListener('click', closeDrawer);
  cartOverlay.addEventListener('click', closeDrawer);

  // ==========================================
  // 4. WHATSAPP CHECKOUT INTEGRATION
  // ==========================================
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast("Shporta juaj është e zbrazët!");
      return;
    }

    // Build the order message text
    let message = `🛒 *POROSI E RE NGA SHOPZONEKS*\n`;
    message += `--------------------------------------\n\n`;
    
    let subtotal = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      message += `• *${item.name}*\n`;
      message += `  Sasia: ${item.quantity} x €${item.price} = *€${itemTotal}*\n\n`;
    });

    message += `--------------------------------------\n`;
    message += `💰 *Totali për pagesë: €${subtotal.toFixed(2)}*\n\n`;
    message += `📦 *Dërgesa:* Postë në Kosovë (Pagesa cash pas pranimit)\n\n`;
    message += `Ju lutem më shkruani të dhënat tuaja për dërgesë:\n`;
    message += `✍️ Emri dhe Mbiemri:\n`;
    message += `📍 Qyteti / Adresa:\n`;
    message += `📞 Numri i telefonit:`;

    // URL encode the message text
    const encodedMessage = encodeURIComponent(message);
    
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
  });

  // ==========================================
  // 5. ADSTERRA INITIALIZATION PLACEHOLDER
  // ==========================================
  // This simulates the premium ad banner behavior
  function initAdSterraMock() {
    const banners = [
      { id: 'adsterra-top-banner', size: '728x90 Banner' },
      { id: 'adsterra-mid-banner', size: 'Native Ad Banner' }
    ];

    banners.forEach(b => {
      const container = document.getElementById(b.id);
      if (container) {
        // Here we render a beautiful, neon-border promotional/sponsored banner mock.
        // It stays fully styled and professional.
        // The user can inject their real script tags directly here.
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        container.style.height = '90px';
        container.style.border = '1px dashed var(--accent-primary)';
        container.style.borderRadius = '8px';
        container.style.background = 'rgba(0, 240, 255, 0.03)';
        
        container.innerHTML = `
          <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; letter-spacing: 2px;">SPONSORED BY ADSTERRA</div>
          <div style="font-size: 0.9rem; color: var(--text-main); margin-top: 4px; font-weight: 500;">Premium Electronics Deals & Offers</div>
          <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">Publisher Account ID: 3380375</div>
        `;
      }
    });

    // Instructions on how to add their actual AdSterra script is left in the comments
    // in index.html for them.
  }

  // --- INITIALIZE EVERYTHING ---
  initSlider();
  initCatalog();
  updateCartBadge();
  renderCartItems();
  initAdSterraMock();
});
