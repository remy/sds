/* eslint-env browser */
/* global Vue */

const HEX = 1;
const TEXT = 0;

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
  },
  computed: {
    loaded() {
      return !!this.app;
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
    asBytes(data, viewAs) {
      let tail = '';
      if (data.length > 256) {
        tail = ` +${data.length - 256} more`;
      }

      if (viewAs === HEX) {
        return (
          data
            .slice(0, 256)
            .map((_) => _.toString(16).padStart(2, '0'))
            .join(' ') + tail
        );
      } else {
        return (
          new TextDecoder().decode(Uint8Array.from(data)).slice(0, 256) + tail
        );
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
