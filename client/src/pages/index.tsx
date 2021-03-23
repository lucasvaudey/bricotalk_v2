import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlCLient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => (
          <div key={p.id}>
            {p.title}
            <div>{p.desc}</div>
          </div>
        ))
      )}
    </>
  );
};

export default withUrqlClient(createUrqlCLient, { ssr: true })(Index);
