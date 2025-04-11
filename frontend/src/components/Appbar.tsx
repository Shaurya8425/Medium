import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function Appbar() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(
      new CustomEvent("auth-state-changed", {
        detail: { isAuthenticated: false, error: null },
      })
    );
    navigate("/signin");
  };

  return (
    <div className='border-b flex justify-between items-center px-10 py-3 mb-2'>
      <div className='text-xl font-bold cursor-pointer'>
        <Link to={"/blogs"}>Blogsy</Link>
      </div>

      <div className='flex items-center gap-4'>
        {user && (
          <div className='flex items-center gap-2'>
            Welcome,
            <Avatar name={user.name} size={8} />
            <span className='font-medium'>{user.name}</span>
          </div>
        )}
      </div>

      <div className='flex justify-center items-center gap-9 w-1/3'>
        <button
          type='button'
          className='text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        >
          <Link to={"/publish"}>Create Blog</Link>
        </button>
        <button
          onClick={handleLogout}
          className='text-red-500 hover:text-red-700 font-medium border border-red-500 rounded px-3 py-1'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Appbar;
