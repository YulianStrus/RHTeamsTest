document.addEventListener("DOMContentLoaded", function () {
  const swiperEl = document.querySelector(".product-swiper");
  if (!swiperEl) return;

  const slidesPerViewDesktop = parseInt(swiperEl.dataset.slidesDesktop, 10) || 3;
  const slidesPerViewTablet = parseInt(swiperEl.dataset.slidesTablet, 10) || 2;
  const slidesPerViewMobile = parseInt(swiperEl.dataset.slidesMobile, 10) || 1;
  const spaceBetween = parseInt(swiperEl.dataset.spaceBetween, 10) || 10;
  const pagination = swiperEl.dataset.pagination === "true";
  const navigation = swiperEl.dataset.navigation === "true";

  // ініціалізація Swiper
  let swiper = new Swiper(swiperEl, {
    slidesPerView: slidesPerViewDesktop,
    spaceBetween: spaceBetween,
    pagination: pagination
      ? {
          el: swiperEl.querySelector(".swiper-pagination"),
          clickable: true,
        }
      : false,
    navigation: navigation
      ? {
          nextEl: swiperEl.querySelector(".swiper-button-next"),
          prevEl: swiperEl.querySelector(".swiper-button-prev"),
        }
      : false,
    breakpoints: {
      320: { slidesPerView: slidesPerViewMobile },
      768: { slidesPerView: slidesPerViewTablet },
      1024: { slidesPerView: slidesPerViewDesktop },
    },
  });

  // --- Фільтрація фото по варіанту ---
  const allSlides = Array.from(swiperEl.querySelectorAll(".swiper-slide"));

  function filterSlides(variantId) {
    let found = false;

    allSlides.forEach((slide) => {
      const variantIds = slide.dataset.variantIds
        ? slide.dataset.variantIds.split(",").map((id) => id.trim())
        : [];

      if (!variantId || variantIds.includes(variantId)) {
        slide.style.display = "";
        found = true;
      } else {
        slide.style.display = "none";
      }
    });

    // якщо не знайшли жодного — показуємо всі
    if (!found) {
      allSlides.forEach((slide) => (slide.style.display = ""));
    }

    swiper.update();
  }

  function getSelectedVariantId() {
    // select[name="id"]
    const select = document.querySelector('select[name="id"]');
    if (select && select.value) return select.value;

    // radio inputs
    const checkedRadio = document.querySelector('input[name="id"]:checked');
    if (checkedRadio) return checkedRadio.value;

    return null;
  }

  // слухаємо зміни варіантів
  const variantSelect = document.querySelector('select[name="id"]');
  if (variantSelect) {
    variantSelect.addEventListener("change", () => {
      filterSlides(variantSelect.value);
    });
  }

  const variantRadios = document.querySelectorAll('input[name="id"]');
  variantRadios.forEach((radio) =>
    radio.addEventListener("change", () => {
      if (radio.checked) filterSlides(radio.value);
    })
  );

  // кастомна подія (деякі теми її викликають)
  document.addEventListener("variant:change", (e) => {
    const variantId = e.detail?.variant?.id || getSelectedVariantId();
    filterSlides(variantId);
  });

  // застосувати фільтр на старті
  filterSlides(getSelectedVariantId());
});
