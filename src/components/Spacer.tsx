import React, {memo} from 'react';
import Stack from './Stack';

const Spacer = () => {
    return (
         <Stack flexible/>
    );
  };
  
  export default memo(Spacer);