import type { Dispatch, FormEvent, SetStateAction } from "react";
import Modal from "./Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API } from "../hooks/getEnv";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "antd";
import { useCookies } from "react-cookie";
import getRequest from "../service/getRequest";
import type { ProductType } from "../types/ProductType";
import Heading from "./Heading";

const DeleteModal = ({
  id,
  isOpen,
  setIsOpen,
}: {
  id: number | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const [token, , deleteCookie] = useCookies(["accessToken"]);
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.delete(`${API}/product/${id}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    onSuccess: () => {
      toast.success("Удалено");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError) => {
      if (err.status === 401) {
        deleteCookie("accessToken");
      }
      toast.error("Что то пошло не так");
      console.log(err);
    },
  });
  const { data, isLoading } = useQuery<{ data: ProductType }>({
    queryKey: ["products", id],
    queryFn: () => getRequest(`/product/${id}`),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    mutate();
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} handleSubmit={handleSubmit}>
        <div className="flex items-center justify-center border-dashed border-[2px] bg-white w-[500px] h-[200px] rounded-[21.73px] gap-[29px] shadow-lg">
          {isLoading ? (
            "Loading..."
          ) : (
            <img
              src={`${API}/file/${data?.data.image}`}
              alt="preview"
              className="w-[90%] h-[90%] object-contain"
            />
          )}
        </div>
        <Heading
          classList="!text-[25px] !text-black !my-[20px]"
          title="Вы хотите удалить этот продукт?"
        />
        <div className="flex gap-10">
          <Button
            className="!text-[22px] !h-[40px] !px-[20px]"
            type="default"
            loading={isPending}
            htmlType="button"
            onClick={() => setIsOpen(false)}
          >
            Закрыть
          </Button>
          <Button
            className="!text-[22px] !h-[40px] !px-[20px]"
            type="primary"
            loading={isPending}
            htmlType="submit"
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteModal;
