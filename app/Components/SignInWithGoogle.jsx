"use client"
import { signIn } from "next-auth/react";
import Image from "next/image";

const  SignInWithGoogle = ()=>{
  return (
    <div
      onClick={() => {
        signIn("google", {redirect:true, callbackUrl:"/Home"})
      }}
      className="flex  items-center gap-2 md:w-48 ml-1  text-[14px] text-black border  hover:scale-105 duration-300 cursor-pointer bg-gray-100 p-2 rounded-md"
    >
      <Image className="w-6 rounded-full " src={"/Icons/google.svg"} alt="Icon/google" />
      <span className="line-clamp-1">Sign in with Google</span>
    </div>
  );
}
export default SignInWithGoogle;