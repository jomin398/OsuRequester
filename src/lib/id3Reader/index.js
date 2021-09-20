function ID3Reader(file_el) {
  var self = this;
  self.init(file_el);
};

ID3Reader.prototype = {
  SUCCESS: 1,
  FAILURE: 2,
  status: 0,
  onload: null,
  file_reader: null,
  result: null,
  worker: null,
  onload: null,


  init: function (el) {
    var self = this;
    self.input_onchange(el);
  },

  input_onchange: function (e) {
    var self = this;
    if (!self.worker) {
      self.worker = new Worker('./src/lib/id3Reader/ID3Reader_worker.js');
      self.worker.onmessage = function (e) {
        self.result = e.data;
        self.onload(self.result);
      };
    }
    self.worker.postMessage(e);
  },
};