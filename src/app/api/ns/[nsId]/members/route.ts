import type { NextRequest } from "next/server";
import { api } from "@/lib/api";
import {
  createOrUpdateMember,
  ZCreateOrUpdateMembers,
} from "@/lib/prisma/createOrUpdateMember";
import { getMembersWithRelation } from "@/lib/prisma/getMembersWithRelation";
import { validatePermission } from "@/lib/validatePermission";
import type { ErrorResponseType } from "@/types/api";
import type { TMemberWithRelation, TNamespaceId } from "@/types/prisma";

export type AddMembersResponse =
  | {
      status: "success";
      members: {
        id: string;
      }[];
    }
  | ErrorResponseType;

export type GetMembersResponse =
  | {
      status: "success";
      members: TMemberWithRelation[];
    }
  | ErrorResponseType;

export const POST = api(
  async (
    req: NextRequest,
    { params }: { params: { nsId: TNamespaceId } },
  ): Promise<AddMembersResponse> => {
    await validatePermission(params.nsId, "admin");

    const body = ZCreateOrUpdateMembers.parse(await req.json());

    const members = await createOrUpdateMember(params.nsId, body, true, true);

    return {
      status: "success",
      members,
    };
  },
);

export const GET = api(
  async (
    _req: NextRequest,
    { params }: { params: { nsId: TNamespaceId } },
  ): Promise<GetMembersResponse> => {
    await validatePermission(params.nsId, "admin");

    const members = await getMembersWithRelation(params.nsId);

    return {
      status: "success",
      members,
    };
  },
);
