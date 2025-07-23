import { CloseOutlined } from "@ant-design/icons";
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";

const Modal = ({
  children,
  isOpen,
  setIsOpen,
  handleSubmit,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  if (!isOpen) return null;
  return (
    <>
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
            type="button"
            className="absolute top-[40px] right-[40px] text-[35px] cursor-pointer"
          >
            <CloseOutlined />
          </button>
          {children}
        </form>
      </div>
    </>
  );
};

export default Modal;
