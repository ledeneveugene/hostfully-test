declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};