"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [key, setKey] = useState("");

  function storeKey() {
    localStorage.setItem("apiKey", key);
  }

  return (
    <div className="bg-gray-100 mt-40 w-2/4 flex flex-col justify-center items-center border p-8 rounded-lg shadow-md">
      <button
        onClick={() => signIn("google")}
        className="mb-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
      >
        Sign in with Google
      </button>

      <div className="flex flex-col justify-center items-center w-full">
        <label
          htmlFor="openai-api-key"
          className="mb-2 text-gray-700 font-medium"
        >
          Gemini API key
        </label>
        <input
          type="text"
          name="openai-api-key"
          onChange={(e) => setKey(e.target.value)}
          value={key}
          className="mb-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        />
        <button
          className="py-2 px-8 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none"
          onClick={() => storeKey()}
        >
          Store
        </button>
      </div>
    </div>
  );
};

export default SignIn;
