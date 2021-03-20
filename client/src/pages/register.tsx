import React from "react";
import { Field, Form, Formik } from "formik";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button, FormErrorMessage, Input } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
interface registerProps {}
const REGISTER_MUTATION = `mutation Register($username: String!, $password: String!){
  register(options:{username: $username, password: $password}){
    errors{
      field
      message
    }
    user{
      id
      username
    }
  }
}`;
export const Register: React.FC<registerProps> = () => {
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values) => {
        console.log(values);
        return register(values);
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
