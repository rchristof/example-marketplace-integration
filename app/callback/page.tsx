"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { exchangeCodeForToken } from "@/lib/vercel/marketplace-api";

// The URL of this page should be added as Redirect URL in your integration settings on Vercel
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const [_, exchange] = useTransition();

  useEffect(() => {
    if (!code) return;

    exchange(async () => {
      const result = await exchangeCodeForToken(code);

      /*
        Important: This is only for demonstration purposes.
        The access token should never be sent to the client. All API calls to the Vercel API should be made from the server.
        Therefore, we use a server action to exchange the code for an access token.
      */
      setAccessToken(result);
    });
  }, [code]);

  return (
    <div className="w-full max-w-2xl divide-y">
      {/*
        Important: The access token is displayed for demonstration purposes only and should never be sent to the client in a production environment.
        Depending on the scopes assigned to your integration, you can use this access token to call the corresponding API endpoints.
      */}
      <div className="py-4 flex items-center">
        <h1 className="text-lg font-medium w-1/3">Vercel Access Token:</h1>
        <div className="w-2/3">
          <code className="text-sm">
            {accessToken ? accessToken : "Loading..."}
          </code>
        </div>
      </div>

      <div className="py-4 flex justify-center">
        <a
          className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
          href={next!}
        >
          {/*
            If you have finished handling the installation, the redirect should happen programmatically
          */}
          Redirect me back to Vercel
        </a>
      </div>
    </div>
  );
}