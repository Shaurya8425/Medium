import { SignupInput } from "@shaurya9154/blogsy-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { login } from "../hooks/api-client";

function SpForm({ type }: { type: "signup" | "signin" }) {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const response = await apiClient.post(
        `/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        type === "signup" ? postInputs : { ...postInputs, name: undefined },
        { headers: { "X-Public-Route": "true" } }
      );

      const jwt = response.data.jwt;
      login(jwt);
      navigate("/blogs");
    } catch (e: any) {
      console.error("Error response:", e.response?.data);

      if (e.response?.data?.error) {
        alert(e.response.data.error);
      } else if (e.response?.status === 403) {
        alert("Invalid username or password");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  }

  const handleChange =
    (field: keyof SignupInput) => (e: ChangeEvent<HTMLInputElement>) => {
      setPostInputs((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <div className='h-screen flex flex-col justify-center'>
      <div className='flex justify-center'>
        <div>
          <div className='px-10'>
            <div className='text-3xl font-extrabold'>
              {type === "signup" ? "Create an account" : "Login"}
            </div>
            <div className='text-slate-500'>
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                className='underline'
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Login" : "Sign up"}
              </Link>
            </div>
          </div>
          <div className='pt-8'>
            {type === "signup" && (
              <LabelledInput
                label='Name'
                placeholder='John Doe'
                onChange={handleChange("name")}
              />
            )}
            <LabelledInput
              label='Username'
              placeholder='johndoe@example.com'
              onChange={handleChange("username")}
            />
            <LabelledInput
              label='Password'
              type='password'
              placeholder='123456'
              onChange={handleChange("password")}
            />
            <button
              onClick={sendRequest}
              type='button'
              className='mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "_");
  return (
    <div>
      <label
        htmlFor={inputId}
        className='block mb-2 text-sm text-black font-semibold pt-4'
      >
        {label}
      </label>
      <input
        type={type || "text"}
        id={inputId}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default SpForm;
