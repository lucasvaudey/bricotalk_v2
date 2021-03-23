import { Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
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
          <NextLink href="/forgot-password">
            <Link>Mot de passe oublié ?</Link>
          </NextLink>
        </Form>
      )}
    </Formik>
  );
};

export default withUrqlClient(createUrqlCLient)(Login);
