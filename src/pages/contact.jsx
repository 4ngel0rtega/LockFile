import { useForm, ValidationError } from "@formspree/react";
import Navbar from "../components/navbar";

const Contact = () => {
  const [state, handleSubmit] = useForm("mkgnvdwj");

  if (state.succeeded) {
    alert(
      "Gracias por contactarnos! Te responderemos lo antes posible."
    );
  }

  return (
    <>
      <Navbar />

      <div className="w-full h-screen bg-slate-900 flex justify-center items-center">
        <div className="rounded-lg shadow-md w-1/3 bg-neutral-700 p-4">
          <h1 className="text-4xl text-white text-center">Contact Us</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-cyan-500 font-bold">
              Email Address
            </label>
            <br />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@mail.com"
              className="rounded-lg bg-neutral-50 w-full h-8 p-2 shadow-md focus:shadow-cyan-500 transition-shadow transition-300 focus:outline-none mt-2 mb-4"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
            <br />
            <label htmlFor="message" className="text-cyan-500 font-bold">
              Message
            </label>
            <br />
            <textarea
              id="message"
              name="message"
              placeholder="Write a small message for the devs!"
              className="rounded-lg bg-neutral-50 w-full h-24 p-2 shadow-md focus:shadow-cyan-500 transition-shadow transition 300 focus:outline-none mt-2 mb-4 rezise-none"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
            <button
              type="submit"
              className="rounded-lg shadow-md w-full h-8 bg-cyan-500 hover:bg-cyan-400 text-white hover:shadow-white transition-shadow transition-bg transition-300"
              disabled={state.submitting}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
