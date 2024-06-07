import React from 'react';

const StockBar = ({ product }) => {
  if (!product) {
    return null; // or some fallback UI
  }

  const barWidth = (product.stock / product.initialStock) * 100;

  return (
    <div className="stock-bar-container">
      <div className="stock-bar" style={{ width: `${barWidth}%` }}></div>
    </div>
  );
};

export default StockBar;
