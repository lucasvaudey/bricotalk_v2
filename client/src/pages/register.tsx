import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, FormErrorMessage, Input } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
interface registerProps {}

export const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
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
