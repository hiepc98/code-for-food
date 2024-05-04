import type { ErrorFallbackProps } from './types';
import React from 'react';
import { EmptyData } from '../EmptyData';

const ErrorFallback: React.FC<ErrorFallbackProps> = ({error}) => {
  // useEffect(() => {
  //   if (error) {
  //     //
  //   }
  // }, [error]);

  return (
    <div className="h-screen w-screen flex center fixed">
      <EmptyData
        isLoading={false}
        title="Something went wrong!"
      />
    </div>
  );
};

export default ErrorFallback;
