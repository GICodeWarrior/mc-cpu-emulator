var Opcodes = {};
Opcodes.by_value = {
  0x00: 'NOT',
  0x01: 'SUBm',
  0x02: 'ADDm',
  0x03: 'ORm',
  0x04: 'STOREm',
  0x05: 'BEQ',
  0x06: 'ANDm',
  0x07: 'LOADm',
  0x09: 'SUBi',
  0x0a: 'ADDi',
  0x0b: 'ORi',
  0x0c: 'OUT',
  0x0d: 'BRA',
  0x0e: 'ANDi',
  0x0f: 'LOADi'
};

(function() {
  Opcodes.by_name = {};
  for (var value in Opcodes.by_value) {
    if (Opcodes.by_value.hasOwnProperty(value)) {
      Opcodes.by_name[Opcodes.by_value[value].toLowerCase()] = parseInt(value);
    }
  }
})();
