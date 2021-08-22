const htmlMinifier = {
  minify: jest.fn(),
};

module.exports = {
  minify: (...args) => htmlMinifier.minify(...args),
};

module.exports.__setMockMinify = (impl) => {
  htmlMinifier.minify = impl;
  return impl;
};
