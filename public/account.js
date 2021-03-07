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

const app = new Vue({
  el: '#app',
  data: {
    viewAs: TEXT,
    loaded: false,
    user: null,
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

      const response = await fetch('/account', {
        method: 'POST',
        body: formData,
      });
      this.update();
    },
    update() {
      fetch('/api/me', {
        credentials: 'same-origin',
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.user = res;
          this.loaded = true;
        })
        .catch((e) => console.log(e));
    },
    download(data) {
      save(Uint8Array.from(data).buffer, 'data.bin');
    },
    async remove(id) {
      if (!confirm('Delete this submission?')) {
        return;
      }

      const res = await fetch('/api/submission/' + id, {
        method: 'DELETE',
      });
      if (res.status !== 200) {
        alert('Something went wrong');
        return;
      }
      this.user.submissions = this.user.submissions.filter((_) => _.id !== id);
    },
  },
  mounted() {
    this.update();
  },
});
