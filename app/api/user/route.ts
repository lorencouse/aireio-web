import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";
import { userUpdate } from "@/utils/functions/user/userUpdate";
import { getUser } from "@/utils/supabase/queries";


export async function GET(request: NextRequest) {
    const supabase = createServerClient();

}

export async function POST(request: NextRequest) {
    const supabase = createServerClient();
}

export async function PUT(request: NextRequest) {
    const supabase = createServerClient();
}

export async function DELETE(request: NextRequest) {
    const supabase = createServerClient();
}