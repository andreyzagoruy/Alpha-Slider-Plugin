(function ( $ ) {

    $.fn.alphaSlider = function () {

      return this.each(function () {

        var $self = $( this ),
            storage = {},
            DOM = {},
            isMoving,
            resizeTimer,
            isInited;

        var methods = {

          init : function () {

            isInited = false;
            isMoving = false;
            storage.currentSlide = 0;
            methods.findCarouselLength();
            methods.updateDOM();
            methods.createControls();
            methods.positionControls();
            methods.bindEvents();

          },

          bindEvents : function () {

            $( window ).on('resize', function () {
              clearTimeout(resizeTimer);
              methods.onResize();
            });

            DOM.$controlLeft.on('click', function () {
              if ( !isMoving ) {
                methods.previousSlide();
              }
            });
            DOM.$controlRight.on('click', function () {
              if ( !isMoving ) {
                methods.nextSlide();
              }
            });

          },

          onResize : function () {

            DOM.$slides.css('transition', '0');
            DOM.$slidesContainer.removeClass('slides-moving');
            DOM.$slides.removeClass('slide-active');
            storage.slideWidth = DOM.$slides.outerWidth();
            methods.moveToSlide(storage.currentSlide);

            resizeTimer = setTimeout(function () {
              methods.updateDOM();
              methods.positionControls();
              DOM.$slides.eq(storage.currentSlide).addClass('slide-active');
            },300);

          },

          findCarouselLength : function () {

            storage.initialCarouselLength = $self.find('.slide').length;

          },

          updateDOM : function () {

            if ( !isInited ) {
              DOM.$carousel = $self;
              DOM.$slides = DOM.$carousel.children();

              //Get slide dimensions to set correct viewport width
              storage.slideWidth = DOM.$slides.outerWidth();
              storage.slideHeight = DOM.$slides.outerHeight();

              //Create viewport to center slides
              DOM.$carousel.children().wrapAll('<div />');
              DOM.$carouselViewport = DOM.$carousel.find('> div');
              DOM.$carouselViewport.addClass('carousel-viewport');
              DOM.$carouselViewport.css('max-width', storage.slideWidth);

              //Create slides container to move carousel
              DOM.$slides.wrapAll('<div />');
              DOM.$slidesContainer = DOM.$carouselViewport.find('> div');
              DOM.$slidesContainer.addClass('slides-container');

              //We need to temporary insert a hidden div to read animation transition tome from not yet applied css class. Needed for correct infinite loop animation
              var $hiddenItem = $("<div>").css('display', 'none').addClass('slides-moving');
              DOM.$slidesContainer.append($hiddenItem);
              storage.transitionTime = parseFloat($hiddenItem.css('transition-duration'));
              $hiddenItem.remove();

              if ( storage.initialCarouselLength < 5 ) {

                storage.itemsCloned = 1;
                storage.firstSlide = storage.itemsCloned;
                storage.currentSlide = storage.firstSlide;
                DOM.$slides.filter(':first').clone().appendTo(DOM.$slidesContainer);
                DOM.$slides.filter(':last').clone().prependTo(DOM.$slidesContainer);
                DOM.$carousel.css('width', storage.slideWidth);
                DOM.$slides = DOM.$slidesContainer.children();
                storage.carouselLength = DOM.$slides.length;
                DOM.$slidesContainer.css('width', storage.carouselLength * storage.slideWidth);
                DOM.$slidesContainer.css('transform', 'translateX(-' + storage.currentSlide * storage.slideWidth + 'px)');
                storage.lastSlide = storage.carouselLength - storage.itemsCloned - 1;
                DOM.$slides.eq(storage.currentSlide).addClass('slide-active');

              } else {

                storage.itemsCloned = 3;
                storage.firstSlide = storage.itemsCloned;
                storage.currentSlide = storage.firstSlide;
                DOM.$slides.filter(':first').before(DOM.$slides.slice(-storage.itemsCloned).clone().addClass('clone'));
                DOM.$slides.filter(':last').after(DOM.$slides.slice(0,storage.itemsCloned).clone().addClass('clone'));
                DOM.$slides = DOM.$slidesContainer.children();
                storage.carouselLength = DOM.$slides.length;
                DOM.$slidesContainer.css('width', storage.carouselLength * storage.slideWidth);
                DOM.$slidesContainer.css('transform', 'translateX(-' + storage.currentSlide * storage.slideWidth + 'px)');
                storage.lastSlide = storage.carouselLength - storage.itemsCloned - 1;
                DOM.$slides.eq(storage.currentSlide).addClass('slide-active');

              }

              DOM.$slides.css('transition', storage.transitionTime + 's');

            } else {

              DOM.$slides.css('transition', storage.transitionTime + 's');
              DOM.$carouselViewport.css('max-width', storage.slideWidth);
              DOM.$slidesContainer.css('width', storage.carouselLength * storage.slideWidth);

            }

            isInited = true;

          },

          createControls : function () {

            DOM.$carouselViewport.append('<span class="slider-control arrow-left fa fa-angle-left"></span>');
            DOM.$carouselViewport.append('<span class="slider-control arrow-right fa fa-angle-right"></span>');
            DOM.$sliderControls = DOM.$carouselViewport.find('.slider-control');
            DOM.$controlLeft = $self.find('.arrow-left');
            DOM.$controlRight = $self.find('.arrow-right');
            storage.controlsSize = parseInt(DOM.$sliderControls.css('font-size'));

          },

          positionControls : function () {

            DOM.$sliderControls.css('top', storage.slideHeight/2 - storage.controlsSize/2);

          },

          moveToSlide : function (slide) {

            DOM.$slidesContainer.css('transform', 'translateX(-' + storage.slideWidth * slide + 'px)');
            storage.currentSlide = slide;
            setTimeout (function () {
              isMoving = false;
            }, storage.transitionTime * 1000);

          },

          nextSlide : function () {

            isMoving = true;
            storage.currentSlide++;
            DOM.$slidesContainer.addClass('slides-moving');
            DOM.$slides.removeClass('slide-active');
            DOM.$slides.eq(storage.currentSlide).addClass('slide-active');
            methods.moveToSlide( storage.currentSlide );
            if (storage.currentSlide == storage.lastSlide + 1 ) {
              DOM.$slides.eq(storage.firstSlide).addClass('slide-active');
              setTimeout(function () {
                  DOM.$slidesContainer.removeClass('slides-moving');
                  methods.moveToSlide( storage.firstSlide );
              }, storage.transitionTime * 1000);
            }
          },

          previousSlide : function () {

            isMoving = true;
            storage.currentSlide--;
            DOM.$slidesContainer.addClass('slides-moving');
            DOM.$slides.removeClass('slide-active');
            DOM.$slides.eq(storage.currentSlide).addClass('slide-active');
            methods.moveToSlide( storage.currentSlide );
            if (storage.currentSlide == storage.firstSlide - 1 ) {
              DOM.$slides.eq(storage.lastSlide).addClass('slide-active');
              setTimeout(function () {
                  DOM.$slidesContainer.removeClass('slides-moving');
                  methods.moveToSlide( storage.lastSlide );
              }, storage.transitionTime * 1000);
            }
          },

        };
        methods.init();
      });
    };

})(jQuery);

$('.carousel').alphaSlider();
