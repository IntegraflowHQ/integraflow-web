module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '#formily-container',
      transform: function(prefix, selector, prefixedSelector) {
        if (selector.match(/^(html|body)/)) {
          return selector.replace(/^([^\s]*)/, prefix); // Prefix html and body
        } else if (selector === '#formily-container') {
          return selector;
        }
        return prefixedSelector;
      },
    },
  },
};
