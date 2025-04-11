
import SpForm from "../components/SpForm";
import Quote from "../components/Quote";

function Signin() {
  return (
    <div className='md:grid md:grid-cols-2 flex flex-col'>
      <SpForm type='signin' />
      <Quote />
    </div>
  );
}

export default Signin;
