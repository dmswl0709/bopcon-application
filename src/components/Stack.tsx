import React, {memo, ReactNode} from 'react';
import styled from '@emotion/native';
import {ViewProps} from 'react-native';
import Direction  from '../constants/Direction';
import Alignment  from '../constants/Alignment';
import { ScrollView } from 'react-native-gesture-handler';

interface StyledStackProps {
  full?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  flexible?: boolean;
  flexShrink?: boolean;
  absolute?: boolean;
  direction?: Direction;
  alignment?: Alignment;
  justifyContent?: Alignment;
  width?: number;
  height?: number;
  spacing?: number;
}

interface StackProps extends ViewProps, StyledStackProps {
  children?: ReactNode;
  scrollable?: boolean;
}

const StyledStack = styled.View<StyledStackProps>`
  display: flex;
  ${({direction}) =>
    direction === 'vertical'
      ? 'flex-direction: columns;'
      : 'flex-direction: row;'}
  ${({flexible}) => (flexible ? 'flex: 1;' : '')}
  ${({flexShrink}) => (flexShrink ? 'flex-shrink: 1;' : '')}
  ${({direction, full}) =>
    full ? (direction === 'vertical' ? 'width: 100%;' : 'height: 100%;') : ''}
  ${({fullWidth}) => fullWidth && 'width: 100%;'}
  ${({fullHeight}) => fullHeight && 'height: 100%;'}
  ${({absolute}) => absolute && 'position: absolute;'}

  ${({alignment}) =>
    alignment === 'center'
      ? 'align-items: center;'
      : alignment === 'end'
      ? 'align-items: flex-end;'
      : 'align-items: flex-start;'};
  
  ${({justifyContent}) =>
    justifyContent === 'center'
      ? 'justify-content: center;'
      : justifyContent === 'end'
      ? 'justify-content: end;'
      : 'justify-content: start;'};
  
  ${({width}) => width && `width: ${width}px;`}
  ${({height}) => height && `height: ${height}px;`}
  ${({spacing}) => spacing && `gap: ${spacing}px;`}
`;

const Stack = ({
  children,
  scrollable,
  direction = 'vertical',
  full,
  fullWidth,
  fullHeight,
  flexible,
  flexShrink,
  absolute,
  alignment = 'center',
  justifyContent = 'center',
  width,
  height,
  ...props
}: StackProps) => {
  return (
      <StyledStack
        direction={direction}
        flexible={flexible}
        flexShrink={flexShrink}
        full={full}
        fullWidth={fullWidth}
        fullHeight={fullHeight}
        absolute={absolute}
        alignment={alignment}
        justifyContent={justifyContent}
        width={width}
        height={height}
        {...props}>
        {children}
      </StyledStack>
  );
};

export default memo(Stack);
export type {StackProps};
