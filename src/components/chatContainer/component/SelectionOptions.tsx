import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import { FC } from "react";
interface SelectionOptionsProps {
  title: string;
  options: { value: string; title: string }[];
  optionCallback: (value: string) => void;
}
const SelectionOptions: FC<SelectionOptionsProps> = ({
  title,
  options,
  optionCallback,
}) => {
  return (
    <div className="absolute -top-12 left-16 ">
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          <span className="text-white">{title}</span>
        </InputLabel>
        <NativeSelect
          onChange={(e) => optionCallback(e.target.value)}
          defaultValue={30}
          inputProps={{
            name: "age",
            id: "uncontrolled-native",
          }}
        >
          {options.length > 0 &&
            options.map((option) => (
              <option key={nanoid()} value={option.value}>
                {option.title}
              </option>
            ))}
        </NativeSelect>
      </FormControl>
    </div>
  );
};

export default SelectionOptions;
