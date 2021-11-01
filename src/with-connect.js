import React, { useState } from 'react';
import { useConnect } from './use-connect';

export const withConnect = Component => props => {
  const [{ loading, error }, open] = useConnect();

  const connect = {
    loading,
    error,
    open,
  };

  return <Component {...props} connect={connect} />;
};
