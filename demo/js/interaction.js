$(function() {
    $('#code-input textarea').auto_assemble('#assembler-listing code',
                                            '#errors',
                                            '#code-input p');

    var params = {};
    var terms = window.location.search.substring(1).split('&');
    for (var i = 0; i < terms.length; ++i) {
      var tuple = terms[i].split('=');
      params[tuple[0].toLowerCase()] = decodeURIComponent(tuple[1]);
    }

    if (params['code']) {
      $('#code-input textarea').val(params['code']);
      $('#code-input textarea').trigger('change');
    }

    var pad = function(value, size) {
      while (value.length < size) {
        value = '0' + value;
      }

      return value;
    };

    var hex = function(value) {
      return pad(value.toString(16), 2);
    }

    var cpu = new CPU();
    var update_status = function() {
      $('.state .pc input').val(hex(cpu.get_pc()));
      $('.state .accumulator input').val(hex(cpu.get_accumulator()));
      $('.state .output input').val(hex(cpu.get_output()));

      var memory_format = {'html': true};
      memory_format['binary'] = $('.memory .binary').is(':checked');
      memory_format['hex'] = $('.memory .hex').is(':checked');
      memory_format['named_hex'] = $('.memory .instructions').is(':checked');
      $('.memory .dump').html(cpu.get_listing().format(memory_format));

      for (var i = 0; i < 8; ++i) {
        var color = ((cpu.get_output() & (1 << i)) > 0) ? 'red' : 'black';
        $('.emulator>.output .x' + i).css('background-color', color);
      }
    };

    $(cpu).bind('error', function(e, message) {
        $('.state .error').html('<strong>ERROR</strong> ' + message);
        update_status();
      });

    $(cpu).bind('step-complete', function(e, opcode, operand) {
        $('.state .log').prepend(
            '<div>Executed: ' + Opcodes.by_value[opcode] +
            ' ' + hex(operand) + '</div>');
        update_status();
      });

    $('.memory input').change(function() {
        update_status();
      });

    $('.state .delay input').change(function() {
        cpu.set_delay($(this).val());
      });

    $('.state .pc button').click(function() {
        cpu.set_pc(parseInt($('.state .pc input').val(), 16));
      });

    $('.state .accumulator button').click(function() {
        cpu.set_accumulator(parseInt($('.state .accumulator input').val(), 16));
      });

    $('.state .output button').click(function() {
        cpu.reset_output();
      });

    $('.state .step').click(function() {
        cpu.step();
      });

    $('.state .run').click(function() {
        cpu.run();
      });

    $('.state .halt').click(function() {
        cpu.halt();
      });

    $('.state .reset').click(function() {
        cpu.reset();
        update_status();
        $('.state .clear-log').click();
        $('.state .error').empty();
      });

    $('.memory .load').click(function() {
        var assembler = new Assembler();
        assembler.assemble($('#code-input textarea').val());
        cpu.load(assembler.get_machine_code());
        update_status();
      });

    $('.state .clear-log').click(function() {
        $('.state .log').empty();
      });

    update_status();
  });
