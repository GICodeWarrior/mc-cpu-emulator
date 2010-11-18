(function($){
  $.fn.enable_log = function(cpu) {
    var me = this;
    var last_line = null;

    $(cpu).bind('step-complete', function(e, opcode, operand) {
        var display = {'instruction': null, 'pc': null, 'accumulator': null,
                       'output': null, 'bin-output': null};
        var count = 0;

        for (var key in display) {
          if (display.hasOwnProperty(key)) {
            display[key] = $(me).find('.options input.' + key).is(':checked');

            if (display[key]) {
              ++count;
            }
          }
        }

        var line = [];
        key = '';
        if (display['pc']) {
          if (count > 1) {
            key = 'pc=';
          }
          line.push(key + Listing.hex(cpu.get_pc()));
        }

        key = '';
        if (display['accumulator']) {
          if (count > 1) {
            key = 'accumulator=';
          }
          line.push(key + Listing.hex(cpu.get_accumulator()));
        }

        key = '';
        if (display['output']) {
          if (count > 1) {
            key = 'output=';
          }
          line.push(key + Listing.hex(cpu.get_output()));
        }

        key = '';
        if (display['bin-output']) {
          if (count > 1) {
            key = 'bin-output=';
          }
          line.push(key + Listing.binary(cpu.get_output()));
        }

        if (display['instruction']) {
          line.push(Listing.instruction(opcode) + ' ' + Listing.hex(operand));
        }

        line = line.join(' ');
        if ((line.length > 0) && (line != last_line)) {
          $(me).find('code').prepend('<div>' + line + '</div>');
          last_line = line;
        }
      });
  };
})(jQuery);
