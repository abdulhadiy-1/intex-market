import { useQuery } from "@tanstack/react-query";
import { DeleteIcon, EditIcon } from "../assets/icons/icon";
import { API } from "../hooks/getEnv";
import type { ProductType } from "../types/ProductType";
import getRequest from "../service/getRequest";
import CreateModal from "./CreateModal";
import { useState } from "react";
import DeleteModal from "../components/DeleteModal";

const ProductTable = ({
  searchItem,
  activeCategory,
}: {
  activeCategory: number;
  searchItem?: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
  const [id, setId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { data, isLoading } = useQuery<{ data: ProductType[] }>({
    queryKey: ["products", activeCategory, searchItem],
    queryFn: () =>
      getRequest(
        `/product?categoryId=${activeCategory}${
          searchItem ? `&shape=${encodeURIComponent(searchItem)}` : ""
        }`
      ),
  });

  return (
    <div>
      <div className="flex w-full py-[17px] px-[50px] bg-white rounded-[30px] text-[20px] mb-[22px] justify-between">
        <div
          style={{ width: `${100 / 7 + 1}%` }}
          className="flex justify-start"
        >
          Изображение
        </div>
        <div
          style={{ width: `${100 / 7 + 3}%` }}
          className="flex justify-start"
        >
          Цена(сум)
        </div>
        <div
          style={{ width: `${100 / 7 - 1}%` }}
          className="flex justify-start"
        >
          Количество
        </div>
        <div
          style={{ width: `${100 / 7 + 2}%` }}
          className="flex justify-start"
        >
          Рамка
        </div>
        <div
          style={{ width: `${100 / 7 - 2}%` }}
          className="flex justify-start"
        >
          Размер(м)
        </div>
        <div style={{ width: `${100 / 7}%` }} className="flex justify-start">
          Глубина(см)
        </div>
        <div
          style={{ width: `${100 / 7 - 7}%` }}
          className="flex justify-start"
        >
          Действия
        </div>
      </div>

      {isLoading ? (
        <div className="w-[100px] mx-auto text-2xl font-bold mt-[100px]">
          Loading...
        </div>
      ) : data?.data.length ? (
        <div className="space-y-[8px]">
          {data?.data?.map((item) => (
            <div
              key={item.id}
              className="flex relative w-full py-[17px] pl-[220px] px-[50px] bg-white rounded-[30px] text-[20px] justify-between max-h-[69px] "
            >
              <div
                className="absolute top-[0] !w-[170px] left-[30px] h-full"
                style={{ width: `${100 / 7 + 2}%` }}
              >
                <img
                  className="!w-full h-full object-contain"
                  src={`${API}/file/${item.image}`}
                  alt=""
                />
              </div>
              <div
                style={{ width: `${100 / 7 + 5}%` }}
                className="leading-[100%]"
              >
                <div className="relative inline-block">
                  <p className="text-[16px] text-gray-600">{item.price}</p>
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500 rotate-[7deg]"></div>
                </div>
                <p className="text-[20px] font-bold">{item.discountPrice}</p>
              </div>
              <div
                style={{ width: `${100 / 7 - 1}%` }}
                className="flex items-center justify-start"
              >
                {item.count}
              </div>
              <div
                style={{ width: `${100 / 7 + 5}%` }}
                className="flex items-center justify-start"
              >
                {item.shape}
              </div>
              <div
                style={{ width: `${100 / 7 - 2}%` }}
                className="flex items-center justify-start"
              >
                {item.size}
              </div>
              <div
                style={{ width: `${100 / 7}%` }}
                className="flex items-center justify-start"
              >
                {item.size}
              </div>
              <div
                style={{ width: `${100 / 7 - 8}%` }}
                className="flex items-center justify-start gap-[18px]"
              >
                <button onClick={() => {setIsOpen(true), setId(item.id)}} className="cursor-pointer">
                <EditIcon /> 
                </button>
                <button onClick={() => {setIsOpenDelete(true), setDeleteId(item.id)}} className="cursor-pointer">
                <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[100px] mx-auto text-2xl font-bold mt-[100px]">
          No data
        </div>
      )}
      <CreateModal id={id} isOpen={isOpen} setIsOpen={setIsOpen} />
      <DeleteModal isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} id={deleteId}  />
    </div>
  );
};

export default ProductTable;
