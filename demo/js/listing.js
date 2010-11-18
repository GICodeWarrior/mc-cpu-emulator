(function($){
  var listing_key = 'listing-change-closure';
  var options = '.options input';

  $.fn.set_listing = function(listing) {
    $(this).unset_listing();

    var me = this;
    var closure = function() {
      update_listing(me, listing);
    };

    $(this).data(listing_key, closure);
    $(this).find(options).change(closure);
    closure();
  };

  $.fn.unset_listing = function() {
    $(this).unbind('change', $(this).data(listing_key));
  };

  var update_listing = function(me, listing) {
    var format = {'address': null, 'binary': null, 'hex': null,
                  'instructions': null};
    for (var key in format) {
      if (format.hasOwnProperty(key)) {
        format[key] = $(me).find(options + '.' + key).is(':checked');
      }
    }
    format['html'] = true;

    $(me).find('code').html(listing.format(format));
  };
})(jQuery);
