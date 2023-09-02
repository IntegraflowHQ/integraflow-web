import { VNode, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { Question, QuestionOption, SurveyAnswer, Theme } from '../../types';
import { hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';

interface DropdownProps {
  question: Question;
  theme?: Theme;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  submitText?: string;
}

export default function DropdownResponse({
  label,
  description,
  question,
  theme,
  onAnswered,
  submitText,
}: DropdownProps): VNode {
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<QuestionOption[]>(
    question.options as QuestionOption[]
  );
  const [positionBelow, setPositionBelow] = useState(true);
  const [dropdownWidth, setDropdownWidth] = useState(100);
  const [inputRectLeft, setInputRectLeft] = useState(0);
  const [inputRectBottom, setInputRectBottom] = useState(0);
  const [inputRectTop, setInputRectTop] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const questionColor = theme?.question ?? '#050505';
  const dropDownMaxHeight = 200;

  const handleInputChange = (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const query = event.currentTarget.value.toLowerCase();
    const filtered = (question.options ?? []).filter((option) =>
      option.label.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
    setSelectedOption(null);
  };

  const handleOptionClick = (option: QuestionOption) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const calculatePosition = () => {
    if (!inputRef.current) return;
    const inputRect = inputRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    setInputRectLeft(inputRect.left);
    setInputRectTop(windowHeight - inputRect.top);
    setInputRectBottom(inputRect.bottom);

    if (
      windowHeight - inputRect.bottom < dropDownMaxHeight &&
      inputRect.top > dropDownMaxHeight
    ) {
      setPositionBelow(false);
    } else {
      setPositionBelow(true);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    setDropdownWidth(inputRef.current.clientWidth);
    calculatePosition();
  }, [inputRef.current?.clientWidth]);

  useEffect(() => {
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, []);

  const dropDownPositionY: h.JSX.CSSProperties = positionBelow
    ? { top: `${inputRectBottom}px` }
    : { bottom: `${inputRectTop}px` };

  const dropdownStyles: h.JSX.CSSProperties = {
    width: `${dropdownWidth}px`,
    maxHeight: `${dropDownMaxHeight}px`,
    backgroundColor: theme?.background ?? '#FFFFFF',
    position: 'absolute',
    overflowY: 'auto',
    left: `${inputRectLeft}px`,
    ...dropDownPositionY,
  };

  const dropdownChildStyles: h.JSX.CSSProperties = {
    padding: '8px',
    color: questionColor,
    backgroundColor: hexToRgba(questionColor, 0.1),
  };

  const darkenBg = (e: h.JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = hexToRgba(questionColor, 0.2);
  };

  const resetBg = (e: h.JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = hexToRgba(questionColor, 0.1);
  };

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedOption) return;
    onAnswered([{ answerId: selectedOption.id, answer: selectedOption.label }]);
  };

  return (
    <form autocomplete={'off'} onSubmit={handleSubmit}>
      <AnswerContainer className={'space-y-4'}>
        <Header
          title={label}
          description={description}
          color={theme?.question}
        />

        <input
          ref={inputRef}
          type='text'
          autocomplete={'off'}
          placeholder='Type or select an option'
          value={selectedOption?.label}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          className={'w-full border rounded-md p-2'}
          style={{
            color: questionColor,
            backgroundColor: hexToRgba(questionColor, 0.1),
          }}
        />

        {isOpen &&
          createPortal(
            <AnswerContainer style={dropdownStyles}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={darkenBg}
                    onMouseLeave={resetBg}
                    style={dropdownChildStyles}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div
                  style={dropdownChildStyles}
                  onMouseEnter={darkenBg}
                  onMouseLeave={resetBg}
                >
                  No results found
                </div>
              )}
            </AnswerContainer>,
            document.getElementById('formily-content-wrapper') as HTMLElement
          )}

        <Button
          label={submitText ?? 'Submit'}
          color={theme?.button}
          size='full'
        />
      </AnswerContainer>
    </form>
  );
}
