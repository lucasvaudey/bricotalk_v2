import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useProps,
} from "@chakra-ui/react";
import { Field, FieldHookConfig, useField } from "formik";
import React from "react";

type InputFieldProps = FieldHookConfig<any> & {
  placeholder: string;
  label: string;
  textarea?: boolean;
};
export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  textarea,
  ...props
}) => {
  let InputOrTextArea;
  if (textarea) {
    InputOrTextArea = Textarea;
  } else {
    InputOrTextArea = Input;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        {...field}
        type={props.type}
        id={field.name}
        placeholder={placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
