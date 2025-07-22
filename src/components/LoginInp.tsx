import { Input } from "antd";

const LoginInp = ({
  placeholder,
  type,
  name,
  loading
}: {
  placeholder?: string;
  type?: string;
  name?: string;
  loading?: boolean
}) => {
  return (
    <>
      {type == "password" ? (
        <Input.Password
          disabled={loading}
          name={name}
          required={true}
          type={type}
          className=" !text-center !py-[10px] !px-[20px] !rounded-[17px] font-bold !text-[20px]"
          style={{ boxShadow: "0 0 10px #CBCBCB" }}
          placeholder={placeholder}
          
        />
      ) : (
        <Input
          disabled={loading}
          name={name}
          required={true}
          type={type}
          className="text-center !py-[10px] !px-[20px] !rounded-[17px] font-bold !text-[20px]"
          style={{ boxShadow: "0 0 10px #CBCBCB" }}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export default LoginInp;
