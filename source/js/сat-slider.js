// Скрипт управляет слайдером кота в разделе
// "Живой пример" на главной странице сайта

(function() {
  'use strict'

  let mainBlock = document.querySelector('.example'),
      controlBlock = mainBlock.querySelector('.example__photos-control'),

      // Контейнер картинок
      photosWrapper = mainBlock.querySelector('.example__photos-wrapper'),

      // Слайдер
      rangeCore = mainBlock.querySelector('.example__photos-control-range-core'),
      slider = mainBlock.querySelector('.example__photos-control-range'),

      // Элементы для сдвига
      overlayBefore = mainBlock.querySelector('.example__photos-wrapper-overlay-before'),
      overlayAfter = mainBlock.querySelector('.example__photos-wrapper-overlay-after'),
      backgroundAfter = mainBlock.querySelector('.example__photos-after-bg');


  // показать скрытые range
  controlBlock.classList.remove('example__photos-control--no-js');

  // Установить сердечник в центр после загрузки стилей
  // (предотвращает баг с неплавным первым сдвигом в Edge & IE11)
  window.onload = function() {
    rangeCore.style.left = (slider.offsetWidth / 2) - (rangeCore.offsetWidth / 2) + 'px';
    console.log(slider.getBoundingClientRect())
    console.log(rangeCore.style.left)
  }

  // Двигать слайдер при юзерской активности
  controlBlock.addEventListener('mousedown', moveSlider);

  // Сбросить все изменения при ресайзе вьюпорта
  window.addEventListener("resize", clearChanges);


  // Работа слайдера
  function moveSlider(evt) {

    // обработать только левую клавишу
    if (evt.which != 1) return;

    let shiftX;
    let core = rangeCore;

    // пределы движения сердечника в слайдере
    let leftBound = 0 - (core.offsetWidth / 2),
        rightBound = slider.offsetWidth - (core.offsetWidth / 2);

    // границы блока с фото относительно вьюпорта
    let photosWrapperLeftBound = photosWrapper.getBoundingClientRect().left,
        photosWrapperRightBound = photosWrapper.getBoundingClientRect().right;

    // если клик по сердечнику слайдера
    if (evt.target.classList.contains('example__photos-control-range-core')) {
      evt.preventDefault();

      // сдвиг курсора на целевом элементе по горизонтали (относительно левого края)
      shiftX = evt.clientX - core.getBoundingClientRect().left;

      // захватить целевой элемент под курсор
      catchUnderCursor(evt.clientX);

      // двигать ползунок с движением курсора
      document.body.addEventListener('mousemove', moveAt);

      // оборвать прослушку движения при "отжатии" мыши
      document.body.onmouseup = function() {
        document.body.removeEventListener('mousemove', moveAt);
        document.body.onmouseleave = null;
        document.body.onmouseup = null;
      }
      // оборвать прослушку движения при ухода курсора с вьюпорта
      // (устраняется глюк с прилипанием ползунка к курсору,
      //  в случае, если "отжатие мыши" произошло за пределами
      //  окна браузера и не произошло событие mouseup)
      document.body.onmouseleave = function() {
        document.body.removeEventListener('mousemove', moveAt);
        document.body.onmouseleave = null;
        document.body.onmouseup = null;
      }
    }

    // если клик по кнопке
    if (evt.target.classList.contains('example__photos-control-button')) {

      // обеспечить плавный переход всем элементам
      core.style.transition = '.7s';
      overlayBefore.style.transition = '.7s';
      overlayAfter.style.transition = '.7s';
      backgroundAfter.style.transition = '.7s';

      // для кнопки "before"
      if(evt.target.classList.contains('example__photos-control-button--before')) {
        // вписать крайнее левое положение
        core.style.left = leftBound + 'px';
        // смесить границы оверлеев и цветового фона
        shiftBounds(slider.getBoundingClientRect().left);
      }

      // для кнопки "after"
      if(evt.target.classList.contains('example__photos-control-button--after')) {
        // вписать крайнее правое положение
        core.style.left = rightBound + 'px';
        // смесить границы оверлеев и цветового фона
        shiftBounds(slider.getBoundingClientRect().right);
      }

      // обнулить плавный переход для нормальной отрисовки
      // перетаскивания сердечника слайдера мышкой
      setTimeout(function() {
        overlayBefore.style.transition = '';
        overlayAfter.style.transition = '';
        backgroundAfter.style.transition = '';
        core.style.transition = '';
      }, 700);
    }

    // Захват всех "движимых элементов" под курсор
    // (для многократного вызова при прослушке движения курсора
    //  с зажатой клавишей мыши)
    function catchUnderCursor(PositionX) {

      // новая позиция (с учетом сдвига курсора)
      let newPosition = PositionX - slider.getBoundingClientRect().left - shiftX;
      
      // не выходить за пределы границ
      if (newPosition < leftBound) newPosition = leftBound;
      if (newPosition > rightBound) newPosition = rightBound;

      // двигать сердечник слайдера
      core.style.left = newPosition + 'px';

      // смесить границы оверлеев и цветового фона
      shiftBounds();
    }

    // функция смещения границ оверлеев и цветового фона
    // в соответствие с центром сердечника слайдера
    function shiftBounds(fixPosition) {

       // расстояние центра сердечника слайдера от левой границы вьюпорта
       let coreCenter = core.getBoundingClientRect().left + (core.offsetWidth / 2);

       if(fixPosition) coreCenter = fixPosition;

       // расстояние от coreCenter до левой и правой границ блока с фото
       let leftDistance = coreCenter - photosWrapperLeftBound,
           rightDistance = photosWrapperRightBound - coreCenter;
       
       // двигать границу левого оверлея
       overlayBefore.style.width = leftDistance + 'px';
       // двигать границу правого оверлея
       overlayAfter.style.width = rightDistance + 'px';
       // двигать цветовую подложку
       backgroundAfter.style.width = rightDistance + 'px';
    }
    
    // функция 'удержания' элемента под
    // курсором для события "mousemove"
    function moveAt(evt) {
      catchUnderCursor(evt.clientX);
    }
  } 

  function clearChanges() {
    overlayBefore.style.width = '';
    overlayAfter.style.width = '';
    backgroundAfter.style.width = '';
    rangeCore.style.left = (slider.offsetWidth / 2) - (rangeCore.offsetWidth / 2) + 'px';
  }

}());