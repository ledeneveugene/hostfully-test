import { Badge, Flex, Text } from "@mantine/core";
import { PropertyReview } from "../../store/properties.types";

interface ReviewProps {
  review: PropertyReview;
}

export const Review = (props: ReviewProps) => {
  const {
    review: { description, numberOfReviews, point },
  } = props;

  return (
    <Flex gap="xs" align={"center"}>
      <Badge color="blue" size="xl" radius="sm">
        {point}
      </Badge>
      <Text fw={700}>{description}</Text>
      <Text fs="italic">{numberOfReviews} review(s)</Text>
    </Flex>
  );
};
