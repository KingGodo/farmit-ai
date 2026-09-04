import { NextRequest } from "next/server";

import { FarmitApiError, farmitPost, jsonError } from "@/lib/farmit-api";
import { toE164 } from "@/lib/phone";

const APPLICANT_TYPES = new Set(["FARMER", "AGRONOMIST"]);

type JoinPayload = {
  alreadyJoined?: boolean;
  districtSignups?: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      phone?: string;
      name?: string;
      email?: string;
      location?: string;
      farmingType?: string;
      applicantType?: string;
    } | null;

    const phone = toE164(body?.phone ?? "");
    const name = body?.name?.trim() ?? "";
    const email = body?.email?.trim() ?? "";
    const location = body?.location?.trim() ?? "";
    const farmingType = body?.farmingType?.trim() || null;
    const applicantType = body?.applicantType ?? "FARMER";

    if (!phone) {
      return Response.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Enter a valid Zimbabwe phone number." },
        },
        { status: 400 }
      );
    }
    if (!name) {
      return Response.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Enter your full name." },
        },
        { status: 400 }
      );
    }
    if (!APPLICANT_TYPES.has(applicantType)) {
      return Response.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Choose farmer or agronomist." },
        },
        { status: 400 }
      );
    }

    try {
      const data = await farmitPost<{ districtSignups?: number }>(
        "/api/v1/waiting-list/open",
        {
          phone,
          name,
          email: email || null,
          location: location || null,
          farmingType,
          applicantType,
        }
      );
      return Response.json({
        success: true,
        data: { districtSignups: data.districtSignups } satisfies JoinPayload,
      });
    } catch (error) {
      if (error instanceof FarmitApiError && error.code === "WAITING_LIST_ALREADY_JOINED") {
        return Response.json({
          success: true,
          data: { alreadyJoined: true } satisfies JoinPayload,
        });
      }
      throw error;
    }
  } catch (error) {
    return jsonError(error);
  }
}
