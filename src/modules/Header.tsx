  import {  LogoutOutlined } from "@ant-design/icons";
import { UserIcon } from "../assets/icons/icon";
import { useCookies } from "react-cookie";

const Header = () => {
  const [,,delToken] = useCookies(['accessToken'])
  return (
    <div className="pt-[39px] pb-[38px] w-full bg-[var(--clr-bg)] border-b-[3px] border-b-[#EBEBFF] flex items-center justify-end text-[var(--clr-grey)] text-[22px] leading-[100%] px-[61px]">
      <h1 className="after:content-[''] after:w-[3px] after:h-[14px] after:bg-[var(--clr-grey)] after:mx-[28px] flex items-center">
        Просмотр веб-сайта
      </h1>
      <div className="flex items-center gap-[10px] after:content-[''] after:w-[3px] after:h-[14px] after:bg-[var(--clr-grey)] after:mx-[28px]">
        <UserIcon /> Joe Melton
      </div>
      <button onClick={() => delToken("accessToken")} className="cursor-pointer">
      <LogoutOutlined />
      </button>
    </div>
  );
};

export default Header;
