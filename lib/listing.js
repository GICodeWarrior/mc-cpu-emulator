var Listing = function(machine_code, old_code, pc) {
  var pad = function(value, size) {
    while (value.length < size) {
      value = '0' + value;
    }

    return value;
  };

  var instruction = function(value) {
    return Opcodes.by_value[value] || hex(value);
  };

  var hex = function(value) {
    return pad(value.toString(16), 2);
  };

  var binary = function(value) {
    return pad(value.toString(2), 8);
  };

  var address_changed = function(address) {
    return old_code && (old_code[address] != machine_code[address]);
  };

  var format_address = function(html, line, address, style) {
    if (html && address_changed(address)) {
      line.push('<span class="changed">');
      line.push(style(machine_code[address]));
      line.push('</span>');
    }
    else {
      line.push(style(machine_code[address]));
    }

    line.push(' ');
  };

  this.format = function(options) {
    var html = options['html'];
    var listing = [];
    for (var address = 0; address < machine_code.length; address += 2) {
      var line = [];

      if (html) {
        line.push(pc == address ? '<div class="pc">' : '<div>');
      }

      if (options['address']) {
        line.push(hex(address));
        line.push(': ');
      }

      if (options['binary']) {
        format_address(html, line, address, binary);
        format_address(html, line, address + 1, binary);
      }

      if (options['hex']) {
        format_address(html, line, address, hex);
        format_address(html, line, address + 1, hex);
      }

      if (options['instructions']) {
        format_address(html, line, address, instruction);
        format_address(html, line, address + 1, hex);
      }

      if (html) {
        line.push('</div>');
      }

      listing.push(line.join(''));
    }

    return listing.join("\n");
  };
}
