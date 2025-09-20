import React from 'react';

// Create a context for resumption state
const ResumptionContext = React.createContext({
  isResuming: false,
  wasRecentlyResumed: false,
  setIsResuming: (value: boolean) => {},
  setWasRecentlyResumed: (value: boolean) => {}
});

export const useResumption = () => React.useContext(ResumptionContext);

export default ResumptionContext; 