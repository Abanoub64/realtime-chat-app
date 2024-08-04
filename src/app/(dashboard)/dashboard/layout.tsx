import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { Icon, Icons } from "@/components/Icons";
import SignOutButton from "@/components/SignOutButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: React.ReactNode;
}

interface sidebarOptions {
  id: number;
  name: string;
  icon: Icon;
  href: string;
}

const sidebarOptions: sidebarOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    icon: "UserPlus",
  },
];

const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  return (
    <div className="w-full flex h-screen ">
      <div className="flex h-full w-full p-2 max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white ">
        <Link href="/dashboard" className=" flex h-16 shrink-0 items-center  ">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        <div className="text-xs font-semibold leading-6 text-gray-400">
          Your Chats
        </div>

        <nav className=" flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>// chats</li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                overview
              </div>
              <ul role="list" className=" -mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.icon];
                  return (
                    <li
                      key={option.id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 hr
                        group flex gap-3 rounded-md p-2 text-2 leading-6 font-semibold
                        "
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600  group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.62rem] font-medium ">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className=" truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              <FriendRequestSidebarOption />
            </li>
            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-6 text-sm font-semibold leading-6  text-gray-900">
                <div className=" relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className=" rounded-full"
                    src={session?.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>{" "}
                <span className=" sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session?.user.name}</span>
                  <span aria-hidden="true" className=" text-xs text-zinc-400">
                    {session?.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-fll" />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default layout;
