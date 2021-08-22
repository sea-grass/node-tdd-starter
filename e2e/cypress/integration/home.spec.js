describe("Home", () => {
  it("should be able to visit the home page", () => {
    cy.visit("/");
  });

  it("should have a button to load more products", () => {
    cy.visit("/");

    cy.contains("See products").click();
  });

  it("should load more products", () => {
    cy.visit("/");

    cy.contains("See products").click();

    cy.contains("Add to cart");
  });

  it("should add products to the cart", () => {
    cy.visit("/");

    cy.contains("See products").click();

    // TODO: Figure out why, even though a request is made each click, it requires two clicks to actually replace the content
    cy.contains("Add to cart").click().click();

    cy.contains("Remove from cart");
  });
});
