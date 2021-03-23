import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";

interface forgotPasswordProps {}

const forgotPassword: React.FC<forgotPasswordProps> = () => {
  const [, resetPassword] = useForgotPasswordMutation();
  const [done, setDone] = useState(Boolean);
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await resetPassword(values);
        if (response.data?.forgotPassword) {
          setDone(true);
        } else {
          setErrors({ email: "Une erreur s'est produite." });
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="email" placeholder="Email" label="Email" />
          <Button isLoading={isSubmitting} type="submit">
            subimit
          </Button>
          <Box>
            <NextLink href="/login">
              <Link>Retour au Login</Link>
            </NextLink>
          </Box>
          {done ? (
            <Box>
              Si l'adresse email existe, un email de réinitialisation de mot de
              passe à été envoyé
            </Box>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default withUrqlClient(createUrqlCLient)(forgotPassword);
