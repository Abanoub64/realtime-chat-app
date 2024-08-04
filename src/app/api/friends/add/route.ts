import { fetchRedis } from "@/healpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { log } from "console";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`);

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (idToAdd === session?.user.id) {
      return new Response("Youu can not add your self as a friend", {
        status: 400,
      });
    }
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_freind_requests`,
      session?.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("You have already added this person as a friend", {
        status: 400,
      });
    }
    const isAlreadyFreind = (await fetchRedis(
      "sismember",
      `user:${session?.user.id}:freind`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFreind) {
      return new Response("You have already added this person as a friend", {
        status: 400,
      });
    }

    // send Freind requestd

    db.sadd(` user:${idToAdd}:incoming_freind_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid requuest payload", { status: 432 });
    }
    return new Response("Invalid  payload", { status: 400 });
  }
}
