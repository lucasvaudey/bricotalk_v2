import { Box, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useCallback, useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 20,
    },
  });
  return (
    <>
      <NavBar />
      <br />
      <Stack spacing={8} ml={400} mr={400} direction={["column"]}>
        {!data ? (
          <div>Loading...</div>
        ) : (
          data.posts.map((p) => (
            <Box key={p.id} shadow="md" borderWidth="1px">
              <Box fontSize={32} p={3} textAlign="center" shadow="md">
                {p.title}
              </Box>
              <Text p={5} fontSize={20}>
                {p.desc.slice(0, 50)}...
              </Text>
            </Box>
          ))
        )}
      </Stack>
    </>
  );
};

export default withUrqlClient(createUrqlCLient, { ssr: true })(Index);
