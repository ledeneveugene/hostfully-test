import {
  Accordion,
  ActionIcon,
  Button,
  Divider,
  Modal,
  Table,
  Text,
} from "@mantine/core";
import { FaCalendarDays, FaPen, FaX } from "react-icons/fa6";
import { DATE_FORMAT } from "../../constants";
import { useGlobalStoreWithZustandards } from "../../store/globalStore";
import { getDateIntervalString } from "../../utils/dateManipulations";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  ActionButtons,
  AlertButtons,
  FlexLine,
  MobileBlock,
  MobileBlockWrapper,
} from "./BookingsList.styles";
import { Fragment, useRef } from "react";

export const BookingsList = () => {
  const bookingId = useRef<string | undefined>();

  const { property, users, editPropertyModal, deleteBooking } =
    useGlobalStoreWithZustandards([
      "property",
      "users",
      "editPropertyModal",
      "deleteBooking",
    ]);

  const [opened, { open, close }] = useDisclosure(false);

  const isDesktop = useMediaQuery("(min-width: 48em)");

  const { bookings, timeZone } = property;
  const { setBooking } = editPropertyModal;

  const onDelete = () => {
    if (bookingId.current) {
      deleteBooking(bookingId.current);
    }
    close();
  };

  const onCancel = () => {
    bookingId.current = undefined;
    close();
  };

  const onOpen = (id: string) => {
    bookingId.current = id;
    open();
  };

  const alertModal = (
    <Modal
      opened={opened}
      onClose={close}
      title="Do you really want to delete the booking?"
    >
      <AlertButtons>
        <Button w="7rem" variant="outline" onClick={onCancel}>
          No
        </Button>
        <Button w="7rem" color="red" onClick={onDelete}>
          Yes
        </Button>
      </AlertButtons>
    </Modal>
  );

  const rows = bookings.map((booking) => {
    const { id, start, end, userId, comment } = booking;

    return (
      <Table.Tr key={id}>
        <Table.Td>
          <Text size="sm">
            {getDateIntervalString(
              [start, end],
              timeZone,
              DATE_FORMAT + " HH:mm"
            )}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text>{users[userId]?.name}</Text>
        </Table.Td>
        <Table.Td>{!!comment && <Text>{comment}</Text>}</Table.Td>
        <Table.Td>
          <ActionButtons>
            <ActionIcon variant="outline" aria-label="Settings" color="blue.5">
              <FaPen onClick={() => setBooking(id)} />
            </ActionIcon>
            <ActionIcon variant="outline" aria-label="Settings" color="red.5">
              <FaX onClick={() => onOpen(id)} />
            </ActionIcon>
          </ActionButtons>
        </Table.Td>
      </Table.Tr>
    );
  });

  const desktopTable = (
    <>
      {!bookings.length ? (
        <Text>There are no bookings yet</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w="16rem">
                Time (&quot;{timeZone}&quot; time zone)
              </Table.Th>
              <Table.Th miw="8rem">User name</Table.Th>
              <Table.Th>Comment</Table.Th>
              <Table.Th w="6rem">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </>
  );

  const mobileBlock = bookings.map((booking) => {
    const { id, start, end, userId, comment } = booking;

    return (
      <Fragment key={id}>
        <Divider />
        <MobileBlockWrapper key={id}>
          <MobileBlock>
            <Text fw={700} size="md">
              {getDateIntervalString(
                [start, end],
                timeZone,
                DATE_FORMAT + " HH:mm"
              )}
            </Text>
            <FlexLine>
              <Text fw={700} td="underline" size="sm" c="blue">
                User name
              </Text>
              <Text size="sm">{users[userId]?.name}</Text>
            </FlexLine>
            {!!comment && (
              <FlexLine>
                <Text fw={700} td="underline" size="sm" c="blue">
                  Comment
                </Text>
                <Text size="sm">{comment}</Text>
              </FlexLine>
            )}
          </MobileBlock>
          <ActionButtons>
            <ActionIcon variant="outline" aria-label="Settings" color="blue.5">
              <FaPen onClick={() => setBooking(id)} />
            </ActionIcon>
            <ActionIcon variant="outline" aria-label="Settings" color="red.5">
              <FaX onClick={() => onOpen(id)} />
            </ActionIcon>
          </ActionButtons>
        </MobileBlockWrapper>
      </Fragment>
    );
  });

  return (
    <>
      <Accordion defaultValue="Bookings">
        <Accordion.Item key={"Bookings"} value={"Bookings"}>
          <Accordion.Control icon={<FaCalendarDays />}>
            {"Your bookings"}
          </Accordion.Control>
          <Accordion.Panel>
            {isDesktop ? desktopTable : mobileBlock}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      {alertModal}
    </>
  );
};
