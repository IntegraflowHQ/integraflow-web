import { Fragment, FunctionComponent, h } from 'preact';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import { DatePickerProps } from 'react-date-picker/';
import 'react-date-picker/dist/DatePicker.css';
import { hexToRgba } from '../utils';

type Props = DatePickerProps & {
  color?: string;
};

const CustomDatePicker: FunctionComponent<Props> = ({
  color = '#050505',
  ...props
}) => {
  const background = hexToRgba(color, 0.1);

  return (
    <Fragment>
      <style>
        {`
          #formily-container .formily-date-picker {
            flex: 1;
            width: 100%;
          }
          #formily-container .formily-date-picker .react-date-picker__wrapper {
            background-color: ${background};
            border-color: ${background};
            border-radius: 12px;
          }
          #formily-container .formily-date-picker .react-date-picker__inputGroup {
            display: flex;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
          }
          #formily-container .formily-date-picker .react-date-picker__inputGroup > input, .react-date-picker__inputGroup__divider, .react-date-picker__inputGroup__leadingZero  {
            color: ${color};
          }
          #formily-container .formily-date-picker .react-date-picker__inputGroup__leadingZero {
            align-self: center;
          }
          #formily-container .formily-date-picker .react-date-picker__inputGroup > input::placeholder {
            color: ${hexToRgba(color, 0.35)};
          }
        `}
      </style>

      <DatePicker {...props} className={'formily-date-picker'} />
    </Fragment>
  );
};

export default CustomDatePicker;
