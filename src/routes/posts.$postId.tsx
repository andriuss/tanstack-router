import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  Link,
} from "@tanstack/react-router";
import { POSTS } from "./posts";

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params }) =>
    Promise.resolve(POSTS.find((p) => p.id === params.postId)),
  errorComponent: PostErrorComponent as any,
  component: PostComponent,
  notFoundComponent: () => {
    return "Nothing found 🫣";
  },
});

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function PostComponent() {
  const post = Route.useLoaderData();
  const { postId } = Route.useParams();
  return (
    <>
      <div className="border p-3 rounded-lg bg-purple-100 mb-4">
        <div>Post id: {postId}</div>
        <p className="text-xl">{post?.name}</p>
      </div>
      {/* <Link to="/posts" className="ml-2" search={(prev) => ({ filter: "cat" })}>
        Back to cats posts
      </Link> */}
    </>
  );
}
