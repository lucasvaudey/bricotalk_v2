import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!data?.me && !fetching) {
      router.replace("/login?next=" + router.pathname);
    } else if (!fetching && data?.me) {
      setDone(true);
    }
  });
  return done;
};
