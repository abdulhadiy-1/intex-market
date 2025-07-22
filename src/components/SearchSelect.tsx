import { Select } from "antd";
import type { Dispatch, SetStateAction } from "react";

interface SearchSelectProps {
  placeholder?: string;
  onChange?: Dispatch<SetStateAction<number | null>>;
  value?: number | null;
  options: {
    value: number;
    label: string;
  }[];
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  placeholder,
  onChange,
  value,
  options,
}) => (
  <Select
    showSearch
    className="w-full !border-b-[1px]"
    style={{ height: 43 }}
    value={value}
    onChange={(val) => onChange?.(val)}
    variant="borderless"
    placeholder={placeholder}
    optionFilterProp="label"
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? "")
        .toLowerCase()
        .localeCompare((optionB?.label ?? "").toLowerCase())
    }
    options={options}
  />
);

export default SearchSelect;
