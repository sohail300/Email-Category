"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]/options";

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [key, setKey] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isClassifying, setClassifying] = useState(false)

  const openEmail = (email) => {
    setSelectedEmail(email);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  function storeKey() {
    localStorage.setItem("apiKey", key);
  }

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await axios.get("/api/emails", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      console.log(response.data.emails)
      setEmails(response.data.emails);
    };
    fetchEmails();
  }, []);

  async function classifyEmails() {
    setClassifying(true);
    try {

      const response = await axios.post('/api/classify', {
        emails
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
          'apiKey': localStorage?.getItem('apiKey')
        }
      })

      setEmails(response.data.categories);
    } catch (err) {
      console.log('Error: ', err)
    } finally {
      setClassifying(false);
    }
  }

  function getColorByCategory(category) {
    console.log(category)
    switch (category?.toLowerCase()) {
      case 'important':
        return '#41c157'; // Green (Forest green)
      case 'promotions':
        return '#FF5f00'; // Orange (Tangerine)
      case 'social':
        return '#007BFF'; // Blue (Royal blue)
      case 'marketing':
        return '#ffc135'; // Yellow (Golden yellow)
      case 'spam':
        return '#e03030'; // Red (Crimson)
      default:
        return '#808080'; // Default color for general or unknown categories
    }
  }

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {
        session ?
          <div className="flex flex-col w-[100%] my-8">
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-8 w-4/5 justify-between m-auto">
              <div className="flex items-center justify-center ">
                <Image src={user.image} height={400} width={400} alt="Profile" className="rounded-full w-16 h-16 object-cover mr-8" />
                <div className="text-center flex flex-col justify-center items-start ">
                  <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>

              <div className="cursor-pointer text-white bg-red-500 hover:bg-red-600 px-6 py-2 font-semibold rounded-md shadow-md" onClick={() => signOut(authOptions)}>
                Logout
              </div>
            </div>


            <div className="flex justify-between items-center p-4 mb-8 w-4/5 m-auto shadow-md ">
              <div>
                <label
                  htmlFor="openai-api-key"
                  className="mb-2 text-gray-700 font-medium"
                >
                  Gemini API key
                </label>
                <input
                  type="password"
                  name="openai-api-key"
                  onChange={(e) => setKey(e.target.value)}
                  value={key}
                  className="mb-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <button
                className="py-2 px-8 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                onClick={() => storeKey()}
              >
                Store
              </button>
            </div>


            <div className="flex justify-between items-center bg-white p-4 mb-8 rounded-lg shadow-md w-4/5 m-auto">
              <div className="flex">
                <label htmlFor="email-count" className="block text-gray-700 font-medium">
                  No. of emails you want to classify
                </label>
                <select
                  name="email-count"
                  id="email-count"
                  // value={itemsPerPage}
                  // onChange={(e) => changeItemsPerPage(e)}
                  className="block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>

              {
                isClassifying ? <button className=" px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none">
                  Classifying...
                </button> : <button className=" px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none" onClick={() => classifyEmails()}>
                  Classify
                </button>
              }

            </div>

            <div className="email-list grid gap-4 w-4/5 m-auto">
              {
                emails ? emails?.map((email) => (
                  <EmailItem key={email.id} email={email} openEmail={openEmail} getColorByCategory={getColorByCategory} />
                ))

                  : <div className="flex justify-center items-center h-60">
                    <div className="blue ball"></div>
                    <div className="red ball"></div>
                    <div className="yellow ball"></div>
                    <div className="green ball"></div>
                  </div>
              }
            </div>
            {
              selectedEmail && (
                <div className="email-details fixed top-0 right-0 h-full w-2/5 bg-[#2c3036] border-l py-4 px-8 shadow-lg transition-transform transform">
                  <button className="mb-4 text-red-500" onClick={() => closeEmail()}>Close</button>
                  <div className="flex justify-between">
                    <h3 className="text-2xl font-semibold text-white mb-2">{selectedEmail.from}</h3>
                    <h3 className="text-2xl font-semibold mb-2"
                      style={{ color: getColorByCategory(selectedEmail.category) }}>
                      {selectedEmail.category}
                    </h3>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedEmail.subject}</h3>
                  <p className="text-sm text-white">{selectedEmail.body}</p>
                </div>
              )
            }

          </div > : <div className="wrapper">
            <div className="blue ball"></div>
            <div className="red ball"></div>
            <div className="yellow ball"></div>
            <div className="green ball"></div>
          </div>
      }
    </>
  );
}



function EmailItem({ email, openEmail, key, getColorByCategory }) {
  return (
    <div className="email-item bg-gray-100 border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEmail(email)} >
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{email.from}</h3>
        <h3 className="text-lg font-semibold mb-2"
          style={{ color: getColorByCategory(email.category) }}>
          {email.category}
        </h3>
      </div>
      <p className="text-sm text-gray-600">{email.snippet}</p>
    </div>
  );
}

export default EmailList;
