"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";


export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {

                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 60 * 24,
            },
        },
    }));

    useEffect(() => {
        const persister = createSyncStoragePersister({
            storage: typeof window !== "undefined" ? window.localStorage : undefined,
        });

        persistQueryClient({
            queryClient,
            persister,
            maxAge: 1000 * 60 * 60 * 24,
        });
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}