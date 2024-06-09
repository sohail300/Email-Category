import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Email Classifier</h1>
      <p className="text-lg text-gray-600 mb-6">Classify your emails efficiently and effectively.</p>
      <a href="/signin" className="block w-1/5 text-center py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-200">Go to Login Page</a>
    </div>
  );
}
