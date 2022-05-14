import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useEffect, useMemo} from "react";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {Button} from "@mui/material";
import {useRouter} from "next/router";


function MyApp({ Component, pageProps }: AppProps) {
  const reactQuery = useMemo(() => new QueryClient(), []);
  const router = useRouter();
  return (
      <QueryClientProvider client={reactQuery}>
        <div style={{ backgroundColor: '#c7eaff', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
  );
}

export default MyApp
