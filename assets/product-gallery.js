function initProductSwiper() {
  const swiperEl = document.querySelector('.product-swiper');
  if (!swiperEl) return;

  // Якщо вже є swiper інстанс - знищуємо
  if (swiperEl.swiper) {
    swiperEl.swiper.destroy(true, true);
  }

  const slidesPerViewDesktop = parseInt(swiperEl.dataset.slidesDesktop, 10) || 3;
  const slidesPerViewTablet = parseInt(swiperEl.dataset.slidesTablet, 10) || 2;
  const slidesPerViewMobile = parseInt(swiperEl.dataset.slidesMobile, 10) || 1;
  const spaceBetween = parseInt(swiperEl.dataset.spaceBetween, 10) || 10;
  const pagination = swiperEl.dataset.pagination === 'true';
  const navigation = swiperEl.dataset.navigation === 'true';

  const swiper = new Swiper(swiperEl, {
    slidesPerView: slidesPerViewDesktop,
    spaceBetween: spaceBetween,
    pagination: pagination ? {
      el: swiperEl.querySelector('.swiper-pagination'),
      clickable: true,
    } : false,
    navigation: navigation ? {
      nextEl: swiperEl.querySelector('.swiper-button-next'),
      prevEl: swiperEl.querySelector('.swiper-button-prev'),
    } : false,
    breakpoints: {
      320: { slidesPerView: slidesPerViewMobile },
      768: { slidesPerView: slidesPerViewTablet },
      1024: { slidesPerView: slidesPerViewDesktop },
    },
  });

  // --- Фільтрація фото по варіантах ---
  function filterSlidesByVariant(variantId) {
    swiper.slides.forEach(slide => {
      const variantIds = slide.dataset.variantIds?.split(',') || [];
      if (variantIds.length === 0 || variantIds.includes(variantId)) {
        slide.style.display = '';
      } else {
        slide.style.display = 'none';
      }
    });
    swiper.update();
  }

  const variantSelect = document.querySelector('[name="id"]');
  if (variantSelect) {
    variantSelect.addEventListener('change', function () {
      filterSlidesByVariant(this.value);
    });
  }

  const variantRadios = document.querySelectorAll('input[name="id"][type="radio"]');
  if (variantRadios.length) {
    variantRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          filterSlidesByVariant(this.value);
        }
      });
    });
  }
}

// --- 1. Запуск при завантаженні сторінки ---
document.addEventListener('DOMContentLoaded', initProductSwiper);

// --- 2. Запуск при редагуванні секцій у Shopify Theme Editor ---
document.addEventListener('shopify:section:load', initProductSwiper);
