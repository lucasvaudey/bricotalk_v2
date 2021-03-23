import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Textarea } from "@chakra-ui/textarea";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { route } from "next/dist/next-server/server/router";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC = () => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  const isAuth = useIsAuth();
  let body;
  if (isAuth === true) {
    body = (
      <div>
        <Formik
          initialValues={{ title: "", desc: "" }}
          onSubmit={async (values, { setErrors }) => {
            if (values.title == "") {
              setErrors({ title: "Le titre ne doit pas être vide" });
            } else if (values.desc == "") {
              setErrors({ desc: "La description ne doit pas être vide" });
            } else {
              console.log("test");
              await createPost({ title: values.title, desc: values.desc });
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField label="Titre" name="title" placeholder="Titre" />
              <InputField
                textarea={true}
                label="Description"
                name="desc"
                placeholder="Description"
              />
              <Button isLoading={isSubmitting} type="submit">
                Créer
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  } else {
    body = <>Loading...</>;
  }
  return body;
};

export default withUrqlClient(createUrqlCLient)(CreatePost);
