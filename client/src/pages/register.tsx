import React from "react";
import { Field, Form, Formik } from "formik";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button, FormErrorMessage, Input } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
interface registerProps {}

export const Register: React.FC<registerProps> = () => {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="username" placeholder="Username" label="Username" />
          <InputField
            type="password"
            name="password"
            placeholder="password"
            label="Password"
          />
          <Button isLoading={isSubmitting} type="submit">
            subimit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
