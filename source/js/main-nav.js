// Управление режимами отображения основной навигации сайта

(function() {
  'use strict'

  let mainNav = document.querySelector('.main-nav'),

      // переключатель меню
      menuToggle = mainNav.querySelector('.site-list__toggle'),
      // элементы меню
      items = mainNav.querySelectorAll('.site-list__item'),
      // Состояния меню
      menuIsDisplayd,
      // Состояния меню на мобильном
      menuIsDisplayedOnMobile;


  // Дождаться подгрузки стилей для
  // получения режима отображения из CSS
  window.addEventListener('load', function() {

    // js подгружен
    menuToggle.classList.remove('site-list__toggle--no-js');

    // Загрузились на мобилном?
    if ( isMobile() ) {
      // console.log('Это мобильный режим: ' + isMobile());
      toggleMenu(false); // скрыть меню
    } else {
      menuToggle.hidden = true; // скрыть кнопку
    };

  });

  // Слушать кнопку-переключатель на мобильном
  menuToggle.addEventListener('click', function() {
    
    if (menuIsDisplayd) {
      toggleMenu(false);
      menuIsDisplayedOnMobile = false;
    } else {
      toggleMenu(true);
      menuIsDisplayedOnMobile = true;
    };

  });

  // Слушать ресайз вьюпорта
  window.addEventListener("resize", function() {

    // если мобильное отображение
    if( isMobile() ) {

      // считать предыдущее состояние меню
      if (menuIsDisplayedOnMobile) {
        toggleMenu(true);
      } else {
        toggleMenu(false);
      };
      menuToggle.hidden = false;

    // для прочих режимов
    } else {
      toggleMenu(true);
      menuToggle.hidden = true;
    };

  });


  // получить текущий режим отображения
  // (string: mobile/tablet/desktop)
  function getCurrentView() {
    return window.getComputedStyle(
            document.querySelector('body'), ':before'
          )
          .getPropertyValue('content')
          .replace(/\"/g, '');
  }

  // Это мобильный режим?
  function isMobile() {
    return getCurrentView() === 'mobile';
  }

  // Переключить отображение меню
  function toggleMenu(show) {

    if(show) { // показать

      for (let i = 1; i < items.length; i++) {
        items[i].style.display = '';
      };
      menuIsDisplayd = true;
      menuToggle.classList.remove('site-list__toggle--closed');
      menuToggle.classList.add('site-list__toggle--open');

    } else { // скрыть

      for (let i = 1; i < items.length; i++) {
        items[i].style.display = 'none';
      };
      menuIsDisplayd = false;
      menuToggle.classList.remove('site-list__toggle--open');
      menuToggle.classList.add('site-list__toggle--closed');

    }
  };
}());