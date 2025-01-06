// @/app/api/register/page.ts
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const BASE_URL = "http://94.74.86.174:8080/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        email,
        username,
        password,
      });

      console.log(res.status);

      if (res.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <main className="h-full w-11/12 md:w-1/2 flex justify-center items-center my-12 text-neutral-50">
      <form onSubmit={handleRegister} className="w-full space-y-4">
        <h1 className="text-xl font-semibold">Sign Up</h1>

        <div>
          <label className="text-white" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-white" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="p-3 font-semibold bg-blue-500 text-white rounded-lg"
          >
            Sign Up
          </button>
          <p>
            Already have an account?&nbsp;
            <span>
              <Link href={"/login"} className="text-blue-600 underline">
                Click here
              </Link>
            </span>
          </p>
        </div>
      </form>
    </main>
  );
}
