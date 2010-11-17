var Assembler = function() {
  var old_machine_code = null;
  var machine_code = null;

  this.assemble = function(code) {
    code = code.replace(/[;#].*$/mg, '');
    code = code.replace(/\s+/g, ' ');
    code = code.replace(/^\s+/, '');
    code = code.replace(/\s+$/, '');
    code = code.toLowerCase();

    var codes = code.split(' ');
    var errors = [];

    old_machine_code = machine_code;
    machine_code = [];

    for (var address = 0; address < codes.length; ++address) {
      if (codes[address].match(/^(0x)?[0-9a-f]{2}$/i)) {
        machine_code.push(parseInt(codes[address], 16));
      }
      else if (codes[address].match(/^\((0x)?[0-9a-f]{2}\)$/i)) {
        machine_code.push(-parseInt(codes[address].slice(1,-1), 16) & 0xFF);
      }
      else if (Opcodes.by_name[codes[address]]) {
        machine_code.push(Opcodes.by_name[codes[address]]);
      }
      else {
        errors.push('Unknown instruction/data: "' + codes[address] + '"');
      }
    }

    if (machine_code.length % 2 != 0) {
      machine_code.push(0x00);
    }

    return errors;
  };

  this.get_listing = function() {
    return new Listing(machine_code, old_machine_code || machine_code);
  };

  this.get_machine_code = function() {
    return machine_code;
  };
};
