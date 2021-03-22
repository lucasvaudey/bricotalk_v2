import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
interface registerProps {}

export const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Formik
      initialValues={{ username: "", password: "", email: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await register(values);
        if (response.data?.register.errors) {
          setErrors(toErrorMap(response.data.register.errors));
        } else if (response.data?.register.user) {
          //worked
          router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="username" placeholder="Username" label="Username" />
          <InputField name="email" placeholder="Email" label="Email" />
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

export default withUrqlClient(createUrqlCLient)(Register);
