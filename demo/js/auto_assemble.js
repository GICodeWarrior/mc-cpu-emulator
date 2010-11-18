(function($){
  $.fn.auto_assemble = function(listing, error_list, permalink) {
    var assembler = new Assembler();

    var change_handler = function() {
      var errors = assembler.assemble($(this).val());

      if (errors) {
        $(error_list).empty();
        for (var i = 0; i < errors.length; ++i) {
          $(error_list).append('<li>' + errors[i] + '</li>');
        }
      }

      if (listing) {
        $(listing).set_listing(assembler.get_listing());
      }

      if (permalink) {
        var code = encodeURIComponent($(this).val());
        $(permalink).html('<a href="?code=' + code + '">permalink</a>');
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
