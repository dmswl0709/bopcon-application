import React, {memo, ReactNode} from 'react';
import styled from '@emotion/native';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  ViewProps,
} from 'react-native';

interface StyledLayoutProps {
  spacing?: number;
}

interface LayoutProps extends ViewProps, StyledLayoutProps {
  children?: ReactNode;
  scrollable?: boolean;
}

const StyledLayout = styled.View<StyledLayoutProps>`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-self: center;
  ${({spacing}) => spacing && `gap: ${spacing}px;`}
`;

const Layout = ({
  children,
  scrollable,
  spacing,
  ...viewProps
}: LayoutProps) => {
  return (
    <SafeAreaView>
       {scrollable ? <ScrollView style={{ display: 'flex',
                                          width:' 100%',
                                          height: '100%'}} >

          <StyledLayout
              spacing={spacing}
              {...viewProps}>
              {children}
          </StyledLayout>

        </ScrollView>
        :
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <StyledLayout
            spacing={spacing}
            {...viewProps}>
            {children}
        </StyledLayout>
        </TouchableWithoutFeedback>
        }
    </SafeAreaView>
  );
};

export default memo(Layout);
