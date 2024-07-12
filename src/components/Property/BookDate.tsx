import { Button, Text, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, UseFormReturnType } from "@mantine/form";
import { DATE_FORMAT } from "../../constants";
import { FormFields, FormFieldsWrapper } from "./BookDate.styles";
import { useGlobalStoreWithZustandards } from "../../store/globalStore";
import {
  Booking,
  BookingError,
  InsertBooking,
  UpdateBooking,
} from "../../store/properties.types";
import dayjs from "dayjs";
import { addCheckInOutTimeToStartEndDates } from "../../utils/dateManipulations";

type DatesRange = [Date | null, Date | null];

interface FormValues {
  dates: DatesRange;
  comment: string;
}

const defaultDates: DatesRange = [null, null];

export const BookDate = () => {
  const { upsertBooking, editPropertyModal, property } =
    useGlobalStoreWithZustandards([
      "upsertBooking",
      "editPropertyModal",
      "property",
    ]);

  const { timeZone } = property;

  const { booking, close } = editPropertyModal;

  const isUpdating = !!booking;
  const submitButtonName = isUpdating ? "Update booking" : "Book property";

  let initialValues: FormValues | undefined = undefined;
  if (isUpdating) {
    const { start, end, comment } = booking;
    const existingDates: DatesRange = [
      dayjs.tz(start, timeZone).tz(dayjs.tz.guess(), true).toDate(),
      dayjs.tz(end, timeZone).tz(dayjs.tz.guess(), true).toDate(),
    ];

    initialValues = {
      dates: existingDates,
      comment,
    };
  }

  const form = useForm<FormValues>({
    initialValues: initialValues ?? {
      dates: defaultDates,
      comment: "",
    },
    validate: {
      comment: (value) =>
        value.length > 50
          ? "Comment length can not be more than 50 symbols"
          : null,
      dates: (value) => {
        return value?.[0] && value?.[1] ? null : "Please select dates";
      },
    },
  });

  const onBooking = (
    values: FormValues,
    form: UseFormReturnType<FormValues>
  ) => {
    const { comment, dates } = values;

    const { start, end } = addCheckInOutTimeToStartEndDates({
      start: dayjs(dates[0]).valueOf(),
      end: dayjs(dates[1]).valueOf(),
      timeZone,
    });

    const addBookingObj: InsertBooking = {
      comment,
      start,
      end,
      userId: "15",
    };

    let result: Booking | BookingError | null = null;

    if (isUpdating) {
      const updateBookingObj: UpdateBooking = {
        ...addBookingObj,
        id: booking.id,
      };

      result = upsertBooking(updateBookingObj);
    } else {
      result = upsertBooking(addBookingObj);
    }

    if (result !== null && "type" in result) {
      return form.setErrors({
        submit: result.message,
      });
    } else {
      return close();
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => onBooking(values, form))}>
      <FormFieldsWrapper>
        <FormFields>
          <DatePickerInput
            type="range"
            required
            clearable
            label="Booking range"
            placeholder="Please select a booking range"
            valueFormat={DATE_FORMAT}
            data-testid="booking-date-picker"
            {...form.getInputProps("dates")}
          />

          <Textarea
            label="Comment"
            placeholder="Please enter a comment.(50 symbols max)"
            {...form.getInputProps("comment")}
          />
          {form.errors.submit && (
            <Text c="red.5" size="sm" data-testid="book-date-submit-error-text">
              {form.errors.submit}
            </Text>
          )}

          <Button type="submit">{submitButtonName}</Button>
        </FormFields>
      </FormFieldsWrapper>
    </form>
  );
};
