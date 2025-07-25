import React from 'react';
import type { OrderType } from '../types/order';

interface OrderItemProps {
  order: OrderType;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  // const formattedDate = new Date(order.createdAt)?.toLocaleDateString('ru-RU');
  
  const getStatusInfo = (status: boolean) => {
    if (status) {
      return {
        text: 'Завершено',
        className: 'bg-green-100 text-green-800',
      };
    }
    return {
      text: 'В обработке',
      className: 'bg-yellow-100 text-yellow-800',
    };
  };

  const statusInfo = getStatusInfo(order.status);
  const product = order.product;
  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="flex w-full py-4 px-12 bg-white rounded-[30px] text-lg items-center">
      <div className="w-[15%] text-gray-700">{order.userName}</div>
      <div className="w-[10%] text-gray-600">{order.userPhone}</div>
      <div className="w-[15%] flex items-center justify-center text-center">
        {!order.product?.image ? (
          <img 
            src={`http://13.61.23.60/${order.product.image}`} 
            alt={order.product.shape}
            className="h-16 w-16 object-cover rounded-md"
          />
        ) : (
          <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
            Нет фото
          </div>
        )}
      </div>
      <div className="w-[15%] text-gray-700">
        {order.product?.size}м / {order.product?.shapeUzb}
      </div>
      <div className="w-[15%] font-semibold">
        {displayPrice.toLocaleString()} сум
      </div>
      <div className="w-[20%] text-gray-600 text-sm">
        {order.userAddress}
      </div>
      <div className="w-[10%] text-gray-500">
        {/* Время будет добавлено, когда появится на сервере */}
      </div>
      <div className="w-[15%] flex items-center justify-start gap-3">
        <button 
          className="text-blue-500 hover:text-blue-700"
          onClick={() => {
            // TODO: Implement edit functionality
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button 
          className="text-red-500 hover:text-red-700"
          onClick={() => {
            // TODO: Implement delete functionality
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
