import React from 'react';
import { Button, Input } from 'antd';
import {LupaIcon} from '../../assets/icons/icon';
import OrderTable from '../../modules/OrderTable';

const Order = () => {
  return (
    <div className="space-y-6 p-6 mt-10">
      <div className="flex items-center justify-between">
          <div className="relative rounded-full overflow-hidden shadow-md">
            <Input placeholder="Найти" className="!py-[15px] !text-[20px] !pl-[34px] !pr-[78px] !border-none !text-[var(--clr-grey)]" />
            <div className="absolute right-[24px] top-[18px] border-l-[1px] border-[var(--clr-grey)] pl-[29px]">
              <LupaIcon />
            </div>
          </div>
        </div>
      
      <div className="bg-white rounded-[30px] shadow-md">
        <OrderTable />
      </div>
    </div>
  );
};

export default Order;