//how do I combine matrix2.js with matrix.js so they combine functions, keep in mind that matrix.js works but I want the effect that matrix2.js has

// Matrix rain effect in JavaScript
class Char {
  constructor() {
    this.element = document.createElement('span');
    this.mutate();
  };
  mutate() {
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    this.element.textContent = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  };
};
class Rain {
  constructor(options) {
    this.options = Object.assign(
      { size: 10, speed: 50, target: document.body, row: 50 },
      options
    );
    this.body = [];
    this.container = document.createElement('div');
    this.container.className = 'rain';
    this.container.style.fontSize = `${this.options.row}px`;
    this.options.target.appendChild(this.container);
    this.init();
    this.fall();
  };
  init() {
    for (let i = 0; i < this.options.size; ++i) {
      let char = new Char();
      this.body.push(char);
      this.container.appendChild(char.element);
    }
  };
  fall() {
    setInterval(() => {
      this.body.forEach((n) => n.mutate());
      this.container.style.top = 
        (parseInt(this.container.style.top || '0') + this.options.row) + 'px';
      if (parseInt(this.container.style.top) > window.innerHeight) {
        this.container.style.top = -this.options.row * this.options.size + 'px';
      }
    }, this.options.speed);
  };
};
function loop(fn, delay = 1000 / 60) {
  let stamp = Date.now();
  function _loop() {
    if (Date.now() - stamp >= delay) {
      fn(); stamp = Date.now();
    }
    requestAnimationFrame(_loop);
  }
  requestAnimationFrame(_loop);
}
class Char {
  constructor() {
    this.element = document.createElement('span');
    this.mutate();
  }
  mutate() {
    this.element.textContent = getChar();
  }
}
class Trail {
  constructor(list = [], options) {
    this.list = list;
    this.options = Object.assign(
      { size: 10, offset: 0 }, options
    );
    this.body = [];
    this.move();
  }
  traverse(fn) {
    this.body.forEach((n, i) => {
      let last = (i == this.body.length - 1);
      if (n) fn(n, i, last);
    });
  }
  move() {
    this.body = [];
    let { offset, size } = this.options;
    for (let i = 0; i < size; ++i) {
      let item = this.list[offset + i - size + 1];
      this.body.push(item);
    }
    this.options.offset = 
      (offset + 1) % (this.list.length + size - 1);
  }
};