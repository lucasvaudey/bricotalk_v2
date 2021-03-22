import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, FormErrorMessage, Input } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlCLient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
interface loginProps {}

export const Login: React.FC<loginProps> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Formik
      initialValues={{ usernameOrEmail: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await login(values);
        if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else if (response.data?.login.user) {
          //worked
          router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="usernameOrEmail"
            placeholder="Username/Email"
            label="Username/Email"
          />
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

export default withUrqlClient(createUrqlCLient)(Login);
