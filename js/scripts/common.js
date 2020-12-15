const common = (($) => {
    'use strict';

    const someFunction = () => {
       
    // nav burger
    $('#nav-burger').click(function(){
      $(this).toggleClass('open');
      $('nav').toggleClass('nav_open');
    });


    $(document).ready(function(){
      $('.bxslider').bxSlider();
    });

   
    };

    const ready = () => {
        someFunction();
    };

   
    return {
        ready: ready
    }

})(jQuery);

jQuery(common.ready);

