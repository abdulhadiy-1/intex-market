import { useEffect, useState } from 'react';
import type { OrderType } from '../types/order';
import OrderItem from '../components/OrderItem';
import { useCookies } from 'react-cookie';

const OrderTable = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookie] = useCookies(["accessToken"]);
      console.log(cookie)


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://13.61.23.60/order', {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzUzMjAyNDI5LCJleHAiOjE3NTMyMDYwMjl9.M_r33TuCR_NqB1pLaHM4I-toSAOaikdNloeyLfl7cC4`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить заказы');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        console.error('Ошибка при загрузке заказов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p>Ошибка при загрузке заказов: {error}</p>
        <p className="mt-2 text-sm text-gray-600">Показаны тестовые данные</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full py-5 px-12 bg-gray-50 rounded-t-[30px] text-gray-600 text-lg font-medium">
        <div className="w-[13%]">Имя клиента</div>
        <div className="w-[10%]">Телефон</div>
        <div className="w-[12%]">Изображение</div>
        <div className="w-[13%]">Размер(м)/Форма</div>
        <div className="w-[12%]">Цена(сум)</div>
        <div className="w-[12%]">Статус</div>
        <div className="w-[28%]">Адрес</div>
        <div className="w-[10%]">Действия</div>
      </div>
      
      <div className="space-y-3 py-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Заказы не найдены
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
