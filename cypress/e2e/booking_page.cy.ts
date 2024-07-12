import { SCREEN_SIZES } from "../constants";

describe("Booking page", () => {
  SCREEN_SIZES.forEach((size) => {
    context(`${Array.isArray(size) ? size.join("x") : size} resolution`, () => {
      beforeEach(() => {
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1]);
        } else {
          cy.viewport(size);
        }
        cy.clock(Date.UTC(2024, 6, 1), ["Date"]);
        cy.visit("http://localhost:5173/");
      });

      it("Should display correct property description data on the page", () => {
        cy.contains(/ilunio les corts spa/i);
        cy.contains(/Cardenal Reig, 11, Les Corts, 08028 Barcelona, Spain/i);

        cy.getByTestId("property-rating-line")
          .should("exist")
          .then(($el) => {
            cy.wrap($el).contains(/4.5/i);
          });

        cy.getByTestId("property-review-line")
          .should("exist")
          .then(($el) => {
            cy.wrap($el).contains(/8/i);
            cy.wrap($el).contains(/very good/i);
            cy.wrap($el).contains(/5642 review\(s\)/i);
          });

        cy.getByTestId("property-review-line")
          .should("exist")
          .then(($el) => {
            cy.wrap($el).contains(/8/i);
            cy.wrap($el).contains(/very good/i);
            cy.wrap($el).contains(/5642 review\(s\)/i);
          });
      });

      it("should display property image", () => {
        cy.getByTestId("property-image");
      });

      it("should display property prices", () => {
        cy.getByTestId("property-prices").then(($el) => {
          cy.wrap($el)
            .contains(/usd 1562.00/i)
            .should("have.css", "color", "rgb(255, 107, 107)");
          cy.wrap($el)
            .contains(/usd 1350.00/i)
            .should("have.css", "color", "rgb(55, 178, 77)");
        });
      });

      it("should display booking button", () => {
        cy.contains("button", "Book now").should("exist");
      });

      describe("Popup window", () => {
        it("should open popup window if booking button was pressed", () => {
          cy.contains("button", "Book now").click();

          cy.getByTestId("book-date-modal").then(($modal) => {
            cy.wrap($modal).contains("h2", /Create booking/);
            cy.wrap($modal).contains("label", /Booking range/i);
            cy.wrap($modal).contains("label", /comment/i);
            cy.wrap($modal).contains("button", /book property/i);
          });
        });

        it("should close popup", () => {
          // Close button click
          cy.contains("button", "Book now").click();
          cy.getByTestId("book-date-modal").then(($modal) => {
            cy.wrap($modal)
              .contains("h2", /Create booking/)
              .should("exist");

            cy.get(".mantine-Modal-close").click();

            cy.wrap($modal)
              .contains("h2", /Create booking/)
              .should("not.exist");
          });

          // Outside click
          cy.contains("button", "Book now").click();
          cy.getByTestId("book-date-modal").then(($modal) => {
            cy.wrap($modal)
              .contains("h2", /Create booking/)
              .should("exist");

            cy.get("body").click(0, 0);

            cy.wrap($modal)
              .contains("h2", /Create booking/)
              .should("not.exist");
          });
        });

        describe("Validation errors", () => {
          it("should display an error if the interval isn't selected", () => {
            cy.contains(/book now/i).click();

            cy.getByTestId("book-date-modal").then(($modal) => {
              cy.wrap($modal)
                .contains(".mantine-InputWrapper-error", "Please select dates")
                .should("not.exist");
              cy.wrap($modal)
                .contains("button", /book property/i)
                .click();

              cy.wrap($modal)
                .contains(".mantine-InputWrapper-error", "Please select dates")
                .should("exist");
            });
          });

          it("should display an error if comment length > 50", () => {
            cy.contains(/book now/i).click();

            cy.getByTestId("book-date-modal").then(($modal) => {
              cy.wrap($modal)
                .contains(
                  ".mantine-InputWrapper-error",
                  "Comment length can not be more than 50 symbols"
                )
                .should("not.exist");
              cy.wrap($modal)
                .contains("label", /comment/i)
                .type("This is the 50 symbols length comment 123 00000001");

              cy.wrap($modal)
                .contains("button", /book property/i)
                .click();

              cy.wrap($modal)
                .contains(
                  ".mantine-InputWrapper-error",
                  "Comment length can not be more than 50 symbols"
                )
                .should("not.exist");
              cy.wrap($modal)
                .contains("label", /comment/i)
                .type("+");

              cy.wrap($modal)
                .contains("button", /book property/i)
                .click();

              cy.wrap($modal)
                .contains(
                  ".mantine-InputWrapper-error",
                  "Comment length can not be more than 50 symbols"
                )
                .should("exist");
            });
          });
        });
      });

      describe("Your bookings block", () => {
        it("should display opened block with correct text", () => {
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .contains(/There are no bookings yet/i)
                .should("be.visible");
              cy.wrap($accordion)
                .contains(/Your bookings/i)
                .click();
              cy.wrap($accordion)
                .contains(/There are no bookings yet/i)
                .should("not.be.visible");
            });
        });
      });

      describe("Delete bookings modal", () => {
        it("should display opened block with correct text", () => {
          cy.contains(/book now/i).click();
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^3$/).click();
            cy.wrap($calendar).contains("button", /^5$/).click();
          });
          cy.contains("label", /comment/i).type(
            "This is the 50 symbols length comment 123 00000001"
          );
          cy.contains("button", /book property/i).click();

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion).getByTestId("delete-icon").click();
            });

          cy.getByTestId("delete-booking-confirmation-modal").then(($modal) => {
            cy.wrap($modal)
              .contains("Do you really want to delete the booking?")
              .should("exist");

            cy.wrap($modal).contains("button", /no/i).should("exist");
            cy.wrap($modal).contains("button", /yes/i).should("exist");

            cy.wrap($modal).contains("button", /no/i).click();
            cy.wrap($modal)
              .contains("Do you really want to delete the booking?")
              .should("exist");
          });

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-time-interval-cell")
                .should("have.text", "07.03.24 14:00 - 07.05.24 12:00");
            });

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion).getByTestId("delete-icon").click();
            });

          cy.getByTestId("delete-booking-confirmation-modal").then(($modal) => {
            cy.wrap($modal)
              .contains("Do you really want to delete the booking?")
              .should("exist");

            cy.wrap($modal).contains("button", /yes/i).click();
            cy.wrap($modal)
              .contains("Do you really want to delete the booking?")
              .should("exist");
          });

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion).contains(/there are no bookings yet/i);
            });
        });
      });

      describe("Flows", () => {
        it("should add, edit and delete bookings", () => {
          // We book 07.03.24 14:00 - 07.05.24 12:00 interval
          cy.contains(/book now/i).click();
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^3$/).click();
            cy.wrap($calendar).contains("button", /^5$/).click();
          });
          cy.contains("label", /comment/i).type(
            "This is the 50 symbols length comment 123 00000001"
          );
          cy.contains("button", /book property/i).click();

          // We book the overlapped interval 07.04.24 14:00 - 07.07.24 12:00.
          cy.contains(/book now/i).click();
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^4$/).click();
            cy.wrap($calendar).contains("button", /^7$/).click();
          });
          cy.contains("label", /comment/i).type("Rebecca. 2 adults+infant");
          cy.contains("button", /book property/i).click();

          cy.getByTestId("book-date-submit-error-text").contains(
            "Sorry, there is a conflict with 07.03.24 14:00 - 07.05.24 12:00 booking. Please select other dates."
          );

          // We book the interval 07.05.24 14:00 - 07.07.24 12:00 immediately after the existing one .
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^5$/).click();
            cy.wrap($calendar).contains("button", /^7$/).click();
          });
          cy.contains("button", /book property/i).click();

          // We book the overlapped interval 07.01.24 14:00 - 07.04.24 12:00.
          cy.contains(/book now/i).click();
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^1$/).click();
            cy.wrap($calendar).contains("button", /^4$/).click();
          });
          cy.contains("label", /comment/i).type("Bill. 2 adults+2 children");
          cy.contains("button", /book property/i).click();

          cy.getByTestId("book-date-submit-error-text").contains(
            "Sorry, there is a conflict with 07.03.24 14:00 - 07.05.24 12:00 booking. Please select other dates."
          );

          // We book the interval 07.05.24 14:00 - 07.07.24 12:00 immediately after the existing one .
          cy.contains(/booking range/i).click();
          cy.get(".mantine-DatePickerInput-levelsGroup").then(($calendar) => {
            cy.wrap($calendar).contains("button", /^1$/).click();
            cy.wrap($calendar).contains("button", /^3$/).click();
          });
          cy.contains("button", /book property/i).click();

          // 3 intervals should be in the bookings list
          const timeIntervals = [
            "07.03.24 14:00 - 07.05.24 12:00",
            "07.05.24 14:00 - 07.07.24 12:00",
            "07.01.24 14:00 - 07.03.24 12:00",
          ];
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-time-interval-cell")
                .each(($cell, index) => {
                  cy.wrap($cell)
                    .invoke("text")
                    .should("equal", timeIntervals[index]);
                });
            });

          // 3 names should be in the bookings list
          const userNames = ["John Lee", "John Lee", "John Lee"];
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-user-name-cell")
                .each(($cell, index) => {
                  cy.wrap($cell)
                    .invoke("text")
                    .should("equal", userNames[index]);
                });
            });

          // 3 comments should be in the bookings list
          const comments = [
            "This is the 50 symbols length comment 123 00000001",
            "Rebecca. 2 adults+infant",
            "Bill. 2 adults+2 children",
          ];
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-comment-cell")
                .each(($cell, index) => {
                  cy.wrap($cell)
                    .invoke("text")
                    .should("equal", comments[index]);
                });
            });

          // Edit a comment
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion).getByTestId("edit-icon").eq(1).click();
            });

          cy.contains("label", /comment/i)
            .click()
            .type("{end}");
          for (let i = 0; i < 7; i++) {
            cy.contains("label", /comment/i).type("{backspace}");
          }

          cy.contains("button", /update booking/i).click();
          cy.contains(/edit booking/i).should("not.exist");

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-comment-cell")
                .eq(1)
                .invoke("text")
                .should("equal", "Rebecca. 2 adults");
            });

          // Delete a comment
          cy.getByTestId("delete-booking-confirmation-modal")
            .contains(/Do you really want to delete the booking\?/i)
            .should("not.exist");
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-time-interval-cell")
                .should("have.length", 3);
            });

          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion).getByTestId("delete-icon").eq(1).click();
            });
          cy.getByTestId("delete-booking-confirmation-modal").then(($modal) => {
            cy.wrap($modal).contains(
              "Do you really want to delete the booking?"
            );

            cy.wrap($modal).contains("button", /yes/i).click();
          });

          const timeIntervalsAfterDeleting = [
            "07.03.24 14:00 - 07.05.24 12:00",
            "07.01.24 14:00 - 07.03.24 12:00",
          ];
          cy.contains(/Your bookings/i)
            .parent()
            .then(($accordion) => {
              cy.wrap($accordion)
                .getByTestId("your-bookings-time-interval-cell")
                .should("have.length", 2)
                .each(($cell, index) => {
                  cy.wrap($cell)
                    .invoke("text")
                    .should("equal", timeIntervalsAfterDeleting[index]);
                });
            });
        });
      });
    });
  });
});
