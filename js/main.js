const slider = document.querySelector('.slider__track');
const previousButton = document.querySelector('.slider__btn--prev');
const nextButton = document.querySelector('.slider__btn--next');

if (slider) {
  const getScrollDistance = () => slider.clientWidth * 0.8;

  previousButton?.addEventListener('click', () => {
    slider.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
  });

  nextButton?.addEventListener('click', () => {
    slider.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
  });
}

const navigation = document.querySelector('.nav--header');
const navigationToggle = document.querySelector('.nav__toggle');
const menuIcon = document.querySelector('.menu-icon');

const closeNavigation = () => {
  navigation?.classList.remove('nav--mobile');
  menuIcon?.classList.remove('menu-icon--active');
  navigationToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
};

navigationToggle?.addEventListener('click', () => {
  const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true';
  navigation?.classList.toggle('nav--mobile', !isExpanded);
  menuIcon?.classList.toggle('menu-icon--active', !isExpanded);
  navigationToggle.setAttribute('aria-expanded', String(!isExpanded));
  document.body.classList.toggle('no-scroll', !isExpanded);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeNavigation();
});
