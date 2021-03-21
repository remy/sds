/* eslint-env browser */
/* global Vue */

const HEX = 1;
const TEXT = 0;

/**
 * @param {Array} buffer
 * @returns {string}
 */
function hexdump(buffer) {
  buffer = Uint8Array.from(buffer);

  let offset = 0;
  const length = buffer.length;

  let out = '';
  let row = '';
  for (var i = 0; i < length; i += 16) {
    row += offset.toString(16).padStart(8, '0') + '  ';
    var n = Math.min(16, length - offset);
    let string = '';
    for (var j = 0; j < 16; ++j) {
      if (j === 8) {
        // group bytes into 8 bytes
        row += ' ';
      }
      if (j < n) {
        var value = buffer[offset];
        string += safeChar(value);
        row += value.toString(16).toLowerCase().padStart(2, '0') + ' ';
        offset++;
      } else {
        row += '   ';
        string += ' ';
      }
    }
    row += ' |' + string + '|\n';
  }
  out += row;
  return out.trim();
}

function safeChar(value) {
  return value >= 0x20 && value <= 0x7e ? String.fromCharCode(value) : '.';
}

const save = (function () {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  return function (data, fileName) {
    let blob = null;

    if (data instanceof Blob) {
      blob = data;
    } else {
      if (!Array.isArray(data)) {
        data = [data];
      }
      blob = new Blob(data, { type: 'octet/stream' });
    }
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
})();

// this is a bit "all in one place" but it'll do for my purposes
new Vue({
  el: '#app',
  data: {
    app: null,
    user: null,
    decode: false,
  },
  computed: {
    loaded() {
      return !!this.app;
    },
    decoded: {
      get() {
        return this.decode;
      },
      set(value) {
        this.decode = value;
      },
    },
    viewAs: {
      get() {
        return this.user ? this.user.viewAs : TEXT;
      },
      set(value) {
        if (this.user) this.user.viewAs = value;
      },
    },
  },
  filters: {
    format(string) {
      const [date, time] = new Date(string).toJSON().split('T');
      return date + ' ' + time.split('.').shift();
    },
    asBytes(data, viewAs, decode) {
      let tail = '';
      if (data.length > 256) {
        tail = ` +${data.length - 256} more`;
      }

      let input = data;
      if (decode) {
        try {
          const str = atob(data.map((_) => String.fromCharCode(_)).join(''));
          input = new Uint8Array(str.length);
          for (let i = 0; i < str.length; i++) {
            input[i] = str.charCodeAt(i);
          }
        } catch (e) {
          console.log(e.stack);
        }
      }

      if (viewAs === HEX) {
        return hexdump(input);
      } else {
        return input.slice(0, 256).map(safeChar).join('') + tail;
      }
    },
  },
  methods: {
    async upload(event) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      await fetch(`/api/app/${this.app.id}`, {
        method: 'POST',
        body: formData,
      });
      this.update();
    },
    update() {
      fetch('/api' + location.pathname, {
        credentials: 'same-origin',
      })
        .then((res) => res.json())
        .then((res) => {
          this.app = res.app;
          this.user = res.user;
        })
        .catch((e) => console.log(e));
    },
    download(res, prefix = '') {
      const data = res.data;
      let filename = res.updatedAt.replace(/[-:TZ.]/g, '');
      if (prefix) filename = prefix + filename;
      save(Uint8Array.from(data).buffer, filename + '.bin');
    },
    async remove(id) {
      if (!confirm('Delete this submission?')) {
        return;
      }

      const res = await fetch(`/api/app/${this.app.id}/submission/${id}`, {
        method: 'DELETE',
      });
      if (res.status !== 200) {
        alert('Something went wrong');
        return;
      }
      this.app.submissions = this.app.submissions.filter((_) => _.id !== id);
    },
  },
  mounted() {
    this.update();
  },
});
