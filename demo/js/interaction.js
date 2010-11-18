$(function() {
    $('.assembler .code textarea').auto_assemble('.assembler .listing',
                                                 '.assembler .errors',
                                                 '.assembler .code .permalink');

    var cpu = new CPU();
    cpu.set_delay($('.controls .delay input').val());

    var update_status = function() {
      $('.registers .pc input').val(Listing.hex(cpu.get_pc()));
      $('.registers .accumulator input').val(Listing.hex(cpu.get_accumulator()));
      $('.registers .output td:first').html(Listing.hex(cpu.get_output()));

      $('.memory').set_listing(cpu.get_listing());

      for (var i = 0; i < 8; ++i) {
        var color = ((cpu.get_output() & (1 << i)) > 0) ? 'red' : 'black';
        $('.torches .x' + i).css('background-color', color);
      }
    };

    $(cpu).bind('error', function(e, message) {
        $('.error').html('<strong>ERROR</strong> ' + message);
        update_status();
      });

    $(cpu).bind('step-complete', function(e, opcode, operand) {
        update_status();
      });

    $('.log').enable_log(cpu);

    $('.controls .delay input').change(function() {
        cpu.set_delay($(this).val());
      });

    $('.controls .step').click(function() {
        cpu.step();
      });

    $('.controls .run').click(function() {
        cpu.run();
      });

    $('.controls .halt').click(function() {
        cpu.halt();
      });

    $('.controls .reset').click(function() {
        cpu.reset();
        update_status();
        $('.log .clear').click();
        $('.error').empty();
      });

    $('.controls .load').click(function() {
        var assembler = new Assembler();
        assembler.assemble($('.assembler .code textarea').val());
        cpu.load(assembler.get_machine_code());
        update_status();
      });

    $('.log .clear').click(function() {
        $('.log code').empty();
      });

    $('.registers .pc button').click(function() {
        cpu.set_pc(parseInt($('.registers .pc input').val(), 16));
        update_status();
      });

    $('.registers .accumulator button').click(function() {
        cpu.set_accumulator(parseInt($('.registers .accumulator input').val(), 16));
        update_status();
      });

    $('.registers .output button').click(function() {
        cpu.reset_output();
        update_status();
      });

    $('.memory .options input').change(function() {
        update_status();
      });

    update_status();

    var params = {};
    var terms = window.location.search.substring(1).split('&');
    for (var i = 0; i < terms.length; ++i) {
      var tuple = terms[i].split('=');
      params[tuple[0].toLowerCase()] = decodeURIComponent(tuple[1]);
    }

    if (params['code']) {
      $('.assembler .code textarea').val(params['code']);
      $('.assembler .code textarea').trigger('change');
      $('.controls .load').trigger('click');
    }
  });
