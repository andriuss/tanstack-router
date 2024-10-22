import * as React from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

// type ProductSearchSortOptions = "newest" | "oldest" | "price";

// type ProductSearch = {
//   page: number;
//   filter?: string;
//   sort?: ProductSearchSortOptions;
// };

const productSearchSchema = z.object({
  page: fallback(z.number(), 1).default(1),
  filter: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price"]), "newest").default(
    "newest"
  ),
});

export const Route = createFileRoute("/posts")({
  component: PostsComponent,
  validateSearch: zodSearchValidator(productSearchSchema),
});

const PAGE_SIZE = 3;

export const POSTS = [
  { id: "1", name: "This is a post about cat." },
  { id: "2", name: "I saw a brown dog yesterday hidden in the grass." },
  { id: "3", name: "An artifact was discovered in the Atlantic Ocean." },
  { id: "4", name: "How many pinguins can fit into whale stomack?" },
] as const;

function PostsComponent() {
  const { filter, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const filteredPosts = POSTS.filter(
    (p) =>
      !filter || p.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  );

  const pagedPosts = filteredPosts.slice(
    page === 1 ? 0 : (page - 1) * PAGE_SIZE,
    PAGE_SIZE * page
  );

  return (
    <div className="p-2">
      <input
        value={filter}
        onChange={(e) => navigate({ search: { filter: e.target.value } })}
        className="border mr-2"
      />
      <button
        className="border px-1 py-0.5 mr-4 bg-blue-100"
        onClick={() => navigate({ search: { filter: "yes" } })}
      >
        Search by string "yes"
      </button>
      <Link to="/posts" search={{ filter: "an" }} className="underline mr-4">
        Filter by "an"
      </Link>
      <button
        className="border px-1 py-0.5 mr-4 bg-blue-100"
        onClick={() => navigate({ to: "/posts" })}
      >
        Reset filter
      </button>
      <div className="mt-4 flex flex-col mb-4">
        {pagedPosts.map((post) => (
          <Link to="/posts/$postId" key={post.id} params={{ postId: post.id }}>
            <div className="border p-2 mb-2 bg-yellow-50 hover:bg-yellow-100">
              {post.name}
            </div>
          </Link>
        ))}
      </div>
      <div className="mb-4">
        <div className="mr-2 inline-block">
          Page {page} of {Math.ceil(filteredPosts.length / PAGE_SIZE)}
        </div>
        <Link
          className={`border px-2 py-1 mr-2 bg-gray-300 ${page === 1 && "opacity-25"}`}
          to="/posts"
          search={(prev) => ({ page: (prev.page ?? 1) - 1 })}
          disabled={page === 1}
        >
          {"<"}
        </Link>
        <Link
          className={`border px-2 py-1 bg-gray-300 ${pagedPosts.length < page * PAGE_SIZE && "opacity-25"}`}
          to="/posts"
          search={(prev) => ({ page: (prev.page ?? 1) + 1 })}
          disabled={pagedPosts.length < page * PAGE_SIZE}
        >
          {">"}
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
