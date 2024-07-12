import { Button, Container, Image, Modal, Rating, Text } from "@mantine/core";
import { getImageURL } from "../../utils";
import { DEFAULT_FRACTIONS } from "../../constants";
import { Review } from "./Review";
import { useGlobalStoreWithZustandards } from "../../store/globalStore";
import {
  CallToAction,
  PriceLine,
  RatingLine,
  Wrapper,
} from "./Property.styles";
import { BookDate } from "./BookDate";
import { BookingsList } from "./BookingsList";

export const Property = () => {
  const { property, editPropertyModal } = useGlobalStoreWithZustandards([
    "property",
    "users",
    "editPropertyModal",
  ]);

  const {
    name,
    address,
    rating: { value: ratingValue, fractions = DEFAULT_FRACTIONS },
    review,
    imageURL,
    dailyPrice: { currency, oldPrice, price },
  } = property;

  const { booking, close, open, opened } = editPropertyModal;

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
            <Text
              td="line-through"
              c="red.5"
              fw="bold"
            >{`${currency} ${oldPrice.toFixed(2)}`}</Text>
            <Text w="bold" c="green.7">{`${currency} ${price.toFixed(2)}`}</Text>
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
