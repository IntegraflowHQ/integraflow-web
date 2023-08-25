import { Fragment, FunctionComponent, h } from 'preact';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import { DatePickerProps } from 'react-date-picker/';
import 'react-date-picker/dist/DatePicker.css';

type Props = DatePickerProps & {
  color?: string;
};

const CustomDatePicker: FunctionComponent<Props> = ({
  color = '#050505',
  ...props
}) => {
  const background = color ? `${color}1A` : '#F0F0F0';

  return (
    <Fragment>
      <style>
        {`
          .formily-date-picker .react-date-picker__wrapper {
            background-color: ${background};
            border-color: ${background};
            border-radius: 12px;
          }
          .formily-date-picker .react-date-picker__inputGroup {
            display: flex;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px 16px;
          }
          .formily-date-picker .react-date-picker__inputGroup > input, .react-date-picker__inputGroup__divider, .react-date-picker__inputGroup__leadingZero  {
            color: ${color}
          }
          .formily-date-picker .react-date-picker__inputGroup > input::placeholder {
            color: ${color}5A;
          }
        `}
      </style>

      <DatePicker {...props} className={'formily-date-picker'} />
    </Fragment>
  );
};

export default CustomDatePicker;
