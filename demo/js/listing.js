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
    var format = {'html': true};

    format['binary'] = $(me).find(options + '.binary').is(':checked');
    format['hex'] = $(me).find(options + '.hex').is(':checked');
    format['named_hex'] = $(me).find(options + '.instructions').is(':checked');
    $(me).find('code').html(listing.format(format));
  };
})(jQuery);
