import React from 'react';
import { useParams } from 'react-router-dom';

import Trade from './../../Trade';
import Seed from './../../Seed';

export default function TradeOrSeed() {
  const { tradeId } = useParams();

  if (tradeId.split('-').length > 2) {
    return <Seed />;
  } else {
    return <Trade />;
  }
}
