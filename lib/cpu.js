var CPU = function() {
  var me = this;

  var pc = 0;
  var accumulator = 0;
  var output = 0;
  var memory = [];
  var old_memory = null;

  var delay = 1000;
  var interval = null;

  var memory_size = 16;

  var last_error = null;
  var error = function(message) {
    last_error = message;
    me.halt();

    if (jQuery) {
      jQuery(me).trigger('error', message);
    }
  };

  var byte_mask = 0xFF;
  var microcode = {
    0x00: function() {  // NOT
        accumulator = ~accumulator & byte_mask;
      },
    0x01: function(address) {  // SUBm
        accumulator = (accumulator - me.read_byte(address)) & byte_mask;
      },
    0x02: function(address) {  // ADDm
        accumulator = (accumulator + me.read_byte(address)) & byte_mask;
      },
    0x03: function(address) {  // ORm
        accumulator |= me.read_byte(address);
      },
    0x04: function(address) {  // STOREm
        me.write_byte(address, accumulator);
      },
    0x05: function(offset) {  // BEQ
        if (accumulator == 0) {
          pc = (pc + offset - 1) & byte_mask;
        }
      },
    0x06: function(address) {  // ANDm
        accumulator &= me.read_byte(address);
      },
    0x07: function(address) {  // LOADm
        accumulator = me.read_byte(address);
      },
    0x09: function(immediate) {  // SUBi
        accumulator = (accumulator - immediate) & byte_mask;
      },
    0x0a: function(immediate) {  // ADDi
        accumulator = (accumulator + immediate) & byte_mask;
      },
    0x0b: function(immediate) {  // ORi
        accumulator |= immediate;
      },
    0x0c: function() {  // OUT
        output = accumulator;
      },
    0x0d: function(offset) {  // BRA
        pc = (pc + offset - 1) & byte_mask;
      },
    0x0e: function(immediate) {  // ANDi
        accumulator &= immediate;
      },
    0x0f: function(immediate) {  // LOADi
        accumulator = immediate;
      },
  };

  var pad = function(value, size) {
    while (value.length < size) {
      value = '0' + value;
    }

    return value;
  };

  var hex = function(value) {
    return pad(value.toString(16), 2);
  };

  this.step = function() {
    if (!this.is_valid_address(pc + 1)) {
      error('Invalid PC: ' + hex(pc));
      return;
    }

    var opcode = this.read_byte(pc++);
    var operand = this.read_byte(pc++);

    if (!microcode[opcode]) {
      error('Invalid opcode: ' + hex(opcode));
      return;
    }

    old_memory = memory.slice(0);
    microcode[opcode](operand);

    if (jQuery) {
      jQuery(me).trigger('step-complete', [opcode, operand]);
    }
  };

  this.run = function() {
    if (!interval) {
      interval = setInterval(function() {
          me.step.apply(me);
        }, delay);
    }
  };

  this.halt = function() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  this.reset = function() {
    pc = 0;
    accumulator = 0;
    output = 0;
    last_error = null;

    this.halt();
  };

  this.get_listing = function() {
    return new Listing(memory, old_memory, pc);
  };

  this.set_delay = function(new_delay) {
    delay = new_delay;

    if (interval) {
      this.halt();
      this.run();
    }
  };

  this.is_valid_address = function(address) {
    return (address < memory_size) && (address >= 0);
  }

  this.read_byte = function(address) {
    if (!this.is_valid_address(address)) {
      error('Attempted read at invalid address: ' + hex(address));
      return;
    }

    if (!memory[address]) {
      memory[address] = 0;
    }

    return memory[address];
  };

  this.write_byte = function(address, data) {
    if (!this.is_valid_address(address)) {
      error('Attempted write at invalid address: ' + hex(address));
      return;
    }
    memory[address] = data;
  };

  this.get_pc = function() {
    return pc;
  };

  this.set_pc = function(new_pc) {
    pc = new_pc;
  };

  this.get_accumulator = function() {
    return accumulator;
  };

  this.set_accumulator = function(new_accumulator) {
    accumulator = new_accumulator;
  };

  this.get_output = function() {
    return output;
  };

  this.reset_output = function() {
    output = 0;
  };

  this.load = function(new_code) {
    if (old_memory) {
      old_memory = memory;
    }
    else {
      old_memory = new_code.slice(0);
    }

    memory = new_code;
    memory_size = new_code.length;
  };
}
