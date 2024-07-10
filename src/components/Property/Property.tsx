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
        <RatingLine>
          <Rating value={ratingValue} fractions={fractions} readOnly />
          <Text fw={700}>{ratingValue}</Text>
        </RatingLine>
        <Review review={review} />
        <Image radius="md" src={getImageURL(imageURL)} />
        <CallToAction>
          <PriceLine>
            <Text
              td="line-through"
              c="red.5"
              fw="bold"
            >{`${currency} ${oldPrice}`}</Text>
            <Text w="bold" c="green.7">{`${currency} ${price}`}</Text>
          </PriceLine>
          <Button onClick={open}>Book now</Button>
        </CallToAction>
        <Modal opened={opened} onClose={close} title={modalTitle}>
          <BookDate />
        </Modal>
        <BookingsList />
      </Wrapper>
    </Container>
  );
};
