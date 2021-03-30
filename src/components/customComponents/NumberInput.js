import React from "react";
import {Decimal} from 'decimal.js';

const CHAR_CODE_0 = 48;
const CHAR_CODE_9 = 57;
const CHAR_CODE_DOT = 46;

const handleNumberInput = options => e => {
  const value = e.target.value;
  const length = value.length;
  const validChars = [];
  let seenDot = false;
  let invalid = false;

  let cursorDelta = -1;

  for (let i = 0; i < length; i++) {
    const cc = value.charCodeAt(i);
    if (options.decimals && cc === CHAR_CODE_DOT) {
      if (seenDot) {
        invalid = true;
    } else {
        if (i === 0) {
            validChars.push(CHAR_CODE_0);
            cursorDelta += 2;
            invalid = true;
        }
        validChars.push(cc);
        seenDot = true;
    }
    }
    else if (cc >= CHAR_CODE_0 && cc <= CHAR_CODE_9) {
      validChars.push(cc);
    } else {
        invalid = true;
      }
  }

  const decimal = value.indexOf(".");
  let decPlaces = null;
  if (decimal > -1) {
      decPlaces = value.slice(decimal + 1).length;
      if (decPlaces > 8) {
          invalid = true;
      }
  }

  let mutatedValue;
  if (invalid) {
      mutatedValue = validChars.length > 0 ? String.fromCharCode(...validChars) : "";

      if (decPlaces && decPlaces > 8) {
        mutatedValue = mutatedValue.slice(0, decimal + 9)
      }
      const cursorPos = e.target.selectionStart + cursorDelta;
      e.target.value = mutatedValue;
      e.target.selectionStart = cursorPos;
      e.target.selectionEnd = cursorPos;
  }
}

const applyDelta = (target, delta) => {
  if (!target) {
    return;
  }

  const value = target.value;
  if (!value) {
    return;
  }

  let dotIndex = value.indexOf('.');
  if (dotIndex < 0) {
    dotIndex = value.length;
  }

  let insertIndex = target.selectionStart;
  if (insertIndex === dotIndex + 1 && insertIndex !== value.length) {
    insertIndex--;
  }

  const deltaQuantity = Math.pow(10, dotIndex >= insertIndex ? dotIndex - insertIndex : dotIndex - insertIndex + 1) * delta;
  const newValue = Decimal(value).add(deltaQuantity);
  if (newValue < 0) {
    return;
  }
  let newValueStr = newValue.toString();

  if (newValueStr.length > value.length) {
    insertIndex++;
  } else if (newValueStr.length < value.length) {
    if (insertIndex > dotIndex) {
      const newDotIndex = newValueStr.indexOf('.');
      if (newDotIndex === -1 && dotIndex !== value.length) {
        newValueStr += '.';
      }

      let targetLength = value.length;
      if (value[0] === '-' && newValueStr[0] !== '-') {
        targetLength--;
      }

      while (newValueStr.length < targetLength) {
        newValueStr += '0';
      }
    }
  }

  target.value = newValueStr;
  target.selectionStart = insertIndex;
  target.selectionEnd = insertIndex;
}

const handleKeyDown = e => {
  if (e.key === 'ArrowUp') {
    applyDelta(e.target, 1);
    e.preventDefault();
  }

  if (e.key === 'ArrowDown') {
    applyDelta(e.target, -1);
    e.preventDefault();
  }
};

export default function NumberInput(props) {
  return (
  <input
    id={props.id}
    className={props.className}
    name={props.name}
    placeholder={props.placeholder}
    type="text"
    onKeyDown={handleKeyDown}
    onChange={handleNumberInput({decimals: props.decimals})}
/>)}