import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useProps,
} from "@chakra-ui/react";
import { Field, FieldHookConfig, useField } from "formik";
import React from "react";

type InputFieldProps = FieldHookConfig<any> & {
  placeholder: string;
  label: string;
};
export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...field}
        type={props.type}
        id={field.name}
        placeholder={placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
