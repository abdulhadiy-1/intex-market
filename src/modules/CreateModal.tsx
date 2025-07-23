import { CloseOutlined } from "@ant-design/icons";
import {
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
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
import type { ProductType } from "../types/ProductType";
import Modal from "../components/Modal";

const CreateModal = ({
  id,
  isOpen,
  setIsOpen,
}: {
  id?: number | null;
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
  const [token, _setCookie, deleteCookie] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();

  const { data: singleProduct } = useQuery<{ data: ProductType }>({
    queryKey: ["product", id],
    queryFn: () => getRequest(`/product/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (singleProduct) {
      setCategory(singleProduct.data.categoryId);
      setStatus(
        singleProduct.data.status == "recommended"
          ? 1
          : singleProduct.data.status == "discount"
          ? 2
          : singleProduct.data.status == "none"
          ? 3
          : 4
      );
      setCount(singleProduct.data.count);
      setStartPrice(singleProduct.data.price);
      setDiscountPrice(singleProduct.data.discountPrice);
      setFrame(singleProduct.data.shape);
      setFrameUz(singleProduct.data.shapeUzb);
      setSize(singleProduct.data.size.toString());
      setDepth(singleProduct.data.size.toString());
    }
  }, [singleProduct]);

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
    {
      value: 4,
      label: "Доступно",
    },
  ];

  const { mutate: ProductMutate } = useMutation({
    mutationFn: (filename: string) => {
      const resolvedStatus =
        status === 1
          ? "recommended"
          : status === 2
          ? "discount"
          : status === 3
          ? "none"
          : "available";
      const data = {
        price: startPrice,
        size: Number(size),
        shape: frame,
        shapeUzb: frameUz,
        status: resolvedStatus,
        count,
        discountPrice,
        categoryId: category,
        image: filename.split("/")[4],
      };

      const config = {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      };

      if (id) {
        return axios.patch(`${API}/product/${id}`, data, config);
      } else {
        return axios.post(`${API}/product`, data, config);
      }
    },

    onSuccess: () => {
      if (id) {
        toast.success("Изменено");
      } else {
        toast.success("Создано");
      }
      setTimeout(() => setIsOpen(false), 300);
      queryClient.invalidateQueries({ queryKey: ["products", category] });
    },

    onError: (err: AxiosError) => {
      if (err.status === 401) {
        deleteCookie("accessToken");
      }
      toast.error("Что то пошло не так");
      console.error(err);
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
      const filename = res.data.fileUrl;
      ProductMutate(filename);
    },
    onError: (err) => {
      console.error(err);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) {
      toast.error("Категория не выбрана");
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      imageMutate(formData);
    } else {
      const filename = singleProduct?.data.image
        ? `${API}/file/${singleProduct.data.image}`
        : "";
      ProductMutate(filename);
    }
  };

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
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} handleSubmit={handleSubmit}>
        <label>
          <input onChange={handleChange} type="file" hidden />
          <div className="flex items-center justify-center border-dashed border-[2px] bg-white border-[#3A3A3A] w-[691px] h-[316px] rounded-[21.73px] gap-[29px] cursor-pointer shadow-lg">
            {file || singleProduct?.data.image ? (
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : `${API}/file/${singleProduct?.data.image}`
                }
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
            {id ? "Изменить" : "Добавить"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateModal;
