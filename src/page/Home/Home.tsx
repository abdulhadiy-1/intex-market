import { Button, Input } from "antd";
import { LupaIcon } from "../../assets/icons/icon";
import ProductTable from "../../modules/ProductTable";
import { useEffect, useMemo, useState } from "react";
import Heading from "../../components/Heading";
import CreateModal from "../../modules/CreateModal";
import { useQuery } from "@tanstack/react-query";
import getRequest from "../../service/getRequest";
import type { CategoryType } from "../../types/CategoryType";
import useDebounce from "../../hooks/useDebounce";

const Home = () => {
  const [active, setActive] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useQuery<{ data: CategoryType[] }>({
    queryKey: ["category"],
    queryFn: () => getRequest("/category"),
  });

  useEffect(() => {
    if (data?.data && data.data.length > 0 && active === 0) {
      setActive(data.data[0].id);
    }
  }, [data, active]);

  const searchItem = useDebounce(search, 1000);

  return (
    <div className="bg-[var(--clr-bg)] h-[100vh] overflow-y-auto pt-[22px]">
      <div className="containers">
        <div className="flex items-center justify-between">
          <div className="relative rounded-full overflow-hidden shadow-md ">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти"
              className="!py-[15px] !text-[20px] !pl-[34px] !pr-[78px] !border-none"
            />
            <div className="absolute right-[24px] top-[18px] border-l-[1px] border-[var(--clr-grey)] pl-[29px]">
              <LupaIcon />
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            type="primary"
            className="!rounded-[29px] !text-[20px] !font-bold !py-[30px] !px-[14px]"
          >
            + Добавить продукт
          </Button>
        </div>
        <div className="flex gap-[46px] justify-center pt-[40px] pb-[66px] w-full">
          {data?.data?.map((item) => (
            <button key={item.id} onClick={() => setActive(item.id)}>
              <Heading
                classList={`${
                  active == item.id &&
                  "!text-[var(--clr-green)] border-b-[3px] border-b-[var(--clr-green)]"
                } cursor-pointer`}
                title={item.name}
              />
            </button>
          ))}
        </div>
        <ProductTable searchItem={searchItem} activeCategory={active} />
      </div>
      <CreateModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Home;
