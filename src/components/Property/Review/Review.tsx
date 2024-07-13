import { Badge, Flex, Text } from "@mantine/core";
import { PropertyReview } from "../../../store/properties.types";

interface ReviewProps {
  review: PropertyReview;
}

export const Review = (props: ReviewProps) => {
  const {
    review: { description, numberOfReviews, point },
  } = props;

  return (
    <Flex gap="xs" align={"center"} data-testid="property-review-line">
      <Badge color="teal.6" size="xl" radius="sm">
        {point}
      </Badge>
      <Text fw={700}>{description}</Text>
      <Text fs="italic">{numberOfReviews} review(s)</Text>
    </Flex>
  );
};
