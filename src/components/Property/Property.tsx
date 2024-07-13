import { Button, Container, Image, Modal, Rating, Text } from "@mantine/core";
import { getImageURL } from "../../utils";
import { DEFAULT_FRACTIONS } from "../../constants";
import { Review } from "./Review/Review";
import { useGlobalStoreWithZustandards } from "../../store/globalStore";
import {
  CallToAction,
  PriceLine,
  RatingLine,
  Wrapper,
} from "./Property.styles";
import { BookDate } from "./BookDate/BookDate";
import { BookingsList } from "./BookingsList/BookingsList";
import { propertySelector } from "./helpers/propertySelector";

export const Property = () => {
  const {
    name,
    address,
    review,
    imageURL,
    rating,
    dailyPrice,
    booking,
    close,
    open,
    opened,
  } = useGlobalStoreWithZustandards(propertySelector);

  const { currency, oldPrice, price } = dailyPrice;
  const { value: ratingValue, fractions = DEFAULT_FRACTIONS } = rating;

  const modalTitle = booking ? "Edit booking" : "Create booking";

  return (
    <Container size="md">
      <Wrapper>
        <Text size="xl">{name}</Text>
        <Text size="sm">{address}</Text>
        <RatingLine data-testid="property-rating-line">
          <Rating value={ratingValue} fractions={fractions} readOnly />
          <Text fw={700}>{ratingValue}</Text>
        </RatingLine>
        <Review review={review} />
        <Image
          radius="md"
          src={getImageURL(imageURL)}
          data-testid="property-image"
        />
        <CallToAction>
          <PriceLine data-testid="property-prices">
            <Text td="line-through" c="red.5" fw="bold">
              {`${currency} ${oldPrice.toFixed(2)}`}
            </Text>
            <Text w="bold" c="green.7">
              {`${currency} ${price.toFixed(2)}`}
            </Text>
          </PriceLine>
          <Button onClick={open}>Book now</Button>
        </CallToAction>
        <Modal
          opened={opened}
          onClose={close}
          title={modalTitle}
          data-testid="book-date-modal"
        >
          <BookDate />
        </Modal>
        <BookingsList />
      </Wrapper>
    </Container>
  );
};
