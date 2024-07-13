import { Property, Users } from "./properties.types";

export const testProperty: Property = {
  id: "45",
  name: "Ilunio Les Corts Spa",
  address: "Cardenal Reig, 11, Les Corts, 08028 Barcelona, Spain",
  rating: {
    value: 4.5,
    fractions: 2,
  },
  timeZone: "Europe/Berlin",
  dailyPrice: {
    currency: "USD",
    oldPrice: 1562,
    price: 1350,
  },
  bookings: [],
  review: {
    point: 8,
    description: "Very good",
    numberOfReviews: 5642,
  },
  imageURL: "/images/property_main.jpg",
};

export const testUsers: Users = {
  "15": {
    name: "John Lee",
  },
};
