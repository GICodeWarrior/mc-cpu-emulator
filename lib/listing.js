var Listing = function(machine_code, old_code, pc) {
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
        line.push(Listing.hex(address));
        line.push(': ');
      }

      if (options['binary']) {
        format_address(html, line, address, Listing.binary);
        format_address(html, line, address + 1, Listing.binary);
      }

      if (options['hex']) {
        format_address(html, line, address, Listing.hex);
        format_address(html, line, address + 1, Listing.hex);
      }

      if (options['instructions']) {
        format_address(html, line, address, Listing.instruction);
        format_address(html, line, address + 1, Listing.hex);
      }

      if (html) {
        line.push('</div>');
      }

      listing.push(line.join(''));
    }

    return listing.join("\n");
  };
}

Listing.pad = function(value, size) {
  while (value.length < size) {
    value = '0' + value;
  }

  return value;
};

Listing.instruction = function(value) {
  return Opcodes.by_value[value] || Listing.hex(value);
};

Listing.hex = function(value) {
  return Listing.pad(value.toString(16), 2);
};

Listing.binary = function(value) {
  return Listing.pad(value.toString(2), 8);
};
