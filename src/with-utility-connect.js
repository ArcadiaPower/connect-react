import React, { useState } from 'react';
import { useUtilityConnect } from './use-utility-connect';

export const withUtilityConnect = Component => props => {
  const [{ loading, error }, open] = useUtilityConnect();

  const utilityConnect = {
    loading,
    error,
    open,
  };

  return <Component {...props} utilityConnect={utilityConnect} />;
};
