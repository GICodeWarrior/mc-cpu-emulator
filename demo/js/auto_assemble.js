(function($){
  $.fn.auto_assemble = function(listing, error_list, permalink) {
    var assembler = new Assembler();
    var listing_format = {'html': true, 'binary': true};

    var change_handler = function() {
      var errors = assembler.assemble($(this).val());

      if (errors) {
        $(error_list).empty();
        for (var i = 0; i < errors.length; ++i) {
          $(error_list).append('<li>' + errors[i] + '</li>');
        }
      }

      if (listing) {
        $(listing).html(assembler.get_listing().format(listing_format));
      }

      if (permalink) {
        $(permalink).html('<a href="?code=' +
                          encodeURIComponent($(this).val()) +
                          '">permalink</a>');
      }
    };
    $(this).change(change_handler);

    var timer = null;
    $(this).keyup(function() {
        var me = this;
        var args = arguments;

        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function() {
            change_handler.apply(me, args);
            timer = null;
          }, 500);
      });
  };
})(jQuery);
