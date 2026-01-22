'use client';
import { useSession } from "next-auth/react";

export default function DebugPage() {
    const { data: session, status } = useSession();

    return (
        <div className="p-8 text-black">
            <h1 className="text-2xl font-bold mb-4">Debug Session</h1>
            <p className="mb-2"><strong>Status:</strong> {status}</p>
            <div className="bg-gray-100 p-4 rounded mb-4">
                <h2 className="font-bold">Client-Side Session Data:</h2>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>

            <p className="text-sm text-gray-600 mt-4">
                If status is "authenticated" but data is null, or if cookie problems persist, check NEXTAUTH_URL and AUTH_TRUST_HOST.
            </p>
        </div>
    );
}
