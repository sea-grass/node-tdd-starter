const eslintConfig = require("./.eslintrc.json");

describe(".eslintrc.json", () => {
  describe(".extends", () => {
    // The prettier rules need to come last so they can overwrite other configs.
    // See: https://github.com/prettier/eslint-config-prettier#installation
    it("should have 'prettier' as the last extends option", () => {
      expect(eslintConfig.extends[eslintConfig.extends.length - 1]).toEqual(
        "prettier"
      );
    });
  });
});
