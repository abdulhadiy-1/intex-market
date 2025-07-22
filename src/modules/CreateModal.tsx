import { CloseOutlined } from "@ant-design/icons";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  CategoryIcon,
  CountIcon,
  FrameIcon,
  ImageIcon,
  PriceIcon,
  SizeIcon,
  StatusIcon,
} from "../assets/icons/icon";
import SearchSelect from "../components/SearchSelect";
import IconInput from "../components/IconInput";
import { Button, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API } from "../hooks/getEnv";
import getRequest from "../service/getRequest";
import type { CategoryType } from "../types/CategoryType";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";

const CreateModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [category, setCategory] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [frame, setFrame] = useState<string>("");
  const [frameUz, setFrameUz] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [token, _setCookie, deleteCookie] = useCookies(["accessToken"])
  const queryClient = useQueryClient();

  const statusOptions = [
    {
      value: 1,
      label: "Рекомендуем",
    },
    {
      value: 2,
      label: "Скидка",
    },
    {
      value: 3,
      label: "Нет в наличии",
    },
  ];

  function resetForm() {
  setCategory(null);
  setStatus(null);
  setCount(0);
  setStartPrice(0);
  setDiscountPrice(0);
  setFrame("");
  setFrameUz("");
  setSize("");
  setDepth("");
  setFile(null);
}


  const { mutate: ProductMutate } = useMutation({
    mutationFn: (filename: string) =>
      axios.post(`${API}/product`, {
        price: startPrice,
        size: Number(size),
        shape: frame,
        shapeUzb: frameUz,
        status:
          status === 1
            ? "recommended"
            : status === 2
            ? "discount"
            : status === 3
            ? "none"
            : "available",
        count,
        discountPrice,
        categoryId: category,
        image: filename.split("/")[4],
      }, {headers: {Authorization: `Bearer ${token.accessToken}`}}),
   onSuccess: () => {
    toast.success("Создано")
    resetForm()
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
    queryClient.invalidateQueries({ queryKey: ["products"] })
  },
  onError: (err: AxiosError) => {
    if(err.status == 401){
      deleteCookie("accessToken")
    }
    console.log(err);
  },
    
  });

  const { mutate: imageMutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(`${API}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      if (!category) {
        toast.error("Категория не выбрана");     
        return;
      }
      const filename = res.data.fileUrl;
      
      ProductMutate(filename);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data } = useQuery<{ data: CategoryType[] }>({
    queryKey: ["category"],
    queryFn: () => getRequest("/category"),
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Файл не выбран");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    imageMutate(formData);
  }

  const rows = [
    [
      {
        icon: <CategoryIcon />,
        title: "Категории",
        component: (
          <SearchSelect
            options={
              data?.data.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            value={category}
            onChange={setCategory}
            placeholder="Select"
          />
        ),
      },
      {
        icon: <CountIcon />,
        title: "Количество",
        component: (
          <Input
            required
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            type="number"
            min={0}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
    ],
    [
      {
        icon: <PriceIcon />,
        title: "Старая цена (сум)",
        component: (
          <Input
            required
            value={startPrice}
            onChange={(e) => setStartPrice(Number(e.target.value))}
            type="number"
            min={0}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
      {
        icon: <PriceIcon />,
        title: "Цена со скидкой (сум)",
        component: (
          <Input
            required
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
            type="number"
            min={0}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
    ],
    [
      {
        icon: <FrameIcon />,
        title: "Рамка",
        component: (
          <Input
            required
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
      {
        icon: <FrameIcon />,
        title: "Рамка на узбекском",
        component: (
          <Input
            required
            value={frameUz}
            onChange={(e) => setFrameUz(e.target.value)}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
    ],
    [
      {
        icon: <SizeIcon />,
        title: "Размер (м)",
        component: (
          <Input
            required
            value={size}
            onChange={(e) => setSize(e.target.value)}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
      {
        icon: <SizeIcon />,
        title: "Глубина(см)",
        component: (
          <Input
            required
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            variant="borderless"
            className="!text-[20px] !bg-white"
          />
        ),
      },
    ],
    [
      {
        icon: <StatusIcon />,
        title: "Статус",
        component: (
          <SearchSelect
            options={statusOptions}
            onChange={setStatus}
            value={status}
            placeholder="Select"
          />
        ),
      },
    ],
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className={`${
          !isOpen && "hidden"
        } absolute inset-0 backdrop-blur-[6px] bg-[#00000058] overflow-y-auto py-[30px] flex`}
      >
        <form
          onSubmit={handleSubmit}
          className="px-[108px] relative py-[40px] bg-[var(--clr-bg)] mx-auto my-auto rounded-[35px] flex flex-col items-center text-[var(--clr-grey)]"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-[40px] right-[40px] text-[35px] cursor-pointer"
          >
            <CloseOutlined />
          </button>

          <label>
            <input onChange={handleChange} type="file" hidden />
            <div className="flex items-center justify-center border-dashed border-[2px] bg-white border-[#3A3A3A] w-[691px] h-[316px] rounded-[21.73px] gap-[29px] cursor-pointer shadow-lg">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-[90%] h-[90%] object-contain"
                />
              ) : (
                <>
                  <ImageIcon />
                  <p className="text-[30px]">Выберите изображение</p>
                </>
              )}
            </div>
          </label>

          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center mt-[33px] w-[1000px] justify-between"
            >
              {row.map((input, index) => (
                <IconInput key={index} icon={input.icon} title={input.title}>
                  {input.component}
                </IconInput>
              ))}
            </div>
          ))}
          <div className="flex w-full justify-center pt-[33px]">
            <Button
              loading={isPending}
              htmlType="submit"
              type="primary"
              className="!rounded-[25px] !text-[25px] w-[240px] !h-[50px]"
            >
              Добавить
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateModal;