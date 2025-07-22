import { LoginInp, LoginModal } from "../../components";
import loginBg from "../../assets/images/loginBg.png";
import { useCookies } from "react-cookie";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { API } from "../../hooks/getEnv";

const Login = () => {
  const [_, setCookie] = useCookies(["accessToken"]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault();

    axios
      .post(`${API}/auth/login`, {
        email: (e.target as HTMLFormElement).email.value,
        password: (e.target as HTMLFormElement).password.value,
      })
      .then((res) => {setLoading(false), setCookie("accessToken", res.data.access_token)})
      .catch(() => {setLoading(false),setError("Не правильный пароль или email")});
  }

  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full h-[100vh] overflow-hidden pt-[10%]"
    >
      <div className="absolute top-0 bottom-0 right-0 left-0  bg-[#00000047] backdrop-blur-[1px]"></div>

      <LoginModal
      loading={loading}
        onSubmit={handleSubmit}
        button="Войти"
        text="Введите имя пользователя и пароль, чтобы получить доступ к системе."
        title="INTEX-MARKET.UZ"
        classList="max-w-[621px] h-[519px] relative !z-1"
      >
        <div className="flex flex-col gap-[16px]">
          <LoginInp loading={loading} name="email" placeholder="Email" type="email" />
          <LoginInp loading={loading} name="password" placeholder="Пароль" type="password" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </LoginModal>
    </div>
  );
};

export default Login;
