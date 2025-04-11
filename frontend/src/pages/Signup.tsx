
import Quote from "../components/Quote";
import SpForm from "../components/SpForm";

function Signup() {
  return (
    <div>
      <div className='md:grid md:grid-cols-2 flex flex-col'>
        <SpForm type="signup"/>
        <Quote />
      </div>
    </div>
  );
}

export default Signup;
