import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useEffect, useMemo} from "react";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {Button, Link as MaterialLink} from "@mui/material";
import {useRouter} from "next/router";
import Link from 'next/link'


function MyApp({ Component, pageProps }: AppProps) {
  const reactQuery = useMemo(() => new QueryClient(), []);
  const router = useRouter();
  return (
      /* @ts-ignore */
      <QueryClientProvider client={reactQuery}>
        <div style={{ backgroundColor: '#c7eaff', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}>
          <Link href="/"><MaterialLink sx={{ marginLeft: 2, marginTop: 1, cursor: 'pointer' }}>Вернуться на главную</MaterialLink></Link>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
  );
}

export default MyApp
