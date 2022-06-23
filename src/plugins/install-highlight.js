import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
// import 'highlight.js/styles/stackoverflow-light.css';
// import 'highlight.js/styles/mono-blue.css';

export default {
  install: (app) => {
    app.directive('highlight', {
      mounted(el) {
        const blocks = el.querySelectorAll('pre code');
        for (let i = 0; i < blocks.length; i++) {
          hljs.highlightElement(blocks[i]);
        }
      },
    });
  },
};
