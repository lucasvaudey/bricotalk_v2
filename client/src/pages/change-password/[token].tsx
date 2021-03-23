import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlCLient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface ChangePasswordProps {
  token?: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");
  return (
    <Formik
      initialValues={{ newPassword: "" }}
      onSubmit={async (values, { setErrors }) => {
        if (token !== undefined) {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            console.log(tokenError);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            //worked
            router.push("/");
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="newPassword"
            placeholder="New Password"
            label="New Password"
            type="password"
          />
          {tokenError ? (
            <Box>
              <NextLink href="/forgot-password">
                <Link>Get a new one</Link>
              </NextLink>
              <Box color="red">{tokenError}</Box>
            </Box>
          ) : null}
          <Button isLoading={isSubmitting} type="submit">
            subimit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlCLient)(ChangePassword);
