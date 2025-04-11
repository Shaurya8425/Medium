import { useEffect, useState } from "react";
import apiClient from "./api-client";

export interface Blog {
  content: string;
  title: string;
  id: number;
  author: {
    name: string;
  };
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get(`/api/v1/blog/${id}`)
      .then((response) => {
        if (response.data.blog) {
          setBlog(response.data.blog);
          setError(null);
        } else {
          setError("Blog not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token"); // Clear invalid token
        }
        setError("Failed to fetch blogs. Please try again later.");
        setLoading(false);
      });
  }, []);

  return { loading, blog, error };
};

const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get(`/api/v1/blog/bulk`)
      .then((response) => {
        if (response.data.blogs) {
          setBlogs(response.data.blogs);
          setError(null);
        } else {
          setError("No blogs found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token"); // Clear invalid token
        }
        setError("Failed to fetch blogs. Please try again later.");
        setLoading(false);
      });
  }, []);

  return { loading, blogs, error };
};

export default useBlogs;
