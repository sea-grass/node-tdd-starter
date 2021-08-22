describe("Home", () => {
  it("should be able to visit the home page", () => {
    cy.visit("/");
  });

  it("should have a button", () => {
    cy.visit("/");

    cy.contains("Click me").click();
  });

  it("should replace the button", () => {
    cy.visit("/");

    cy.contains("Click me").click();

    cy.contains("New stuff");
  });
});
