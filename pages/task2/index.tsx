import {Button, Container, Link, Paper} from "@mui/material";
import Head from "next/head";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import {useQuery} from "react-query";

function Task1() {

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useQuery('key', () => ({

  }), {
    refetchOnMount: true,
  })

  if (!loaded) {
    return null;
  }

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', width: '100%' }}>
        <Head>
          <title>Моделирование процесса распределения портфеля заказов</title>
        </Head>
        <Paper sx={{ backgroundColor: '#fff', padding: 2, minHeight: 300, minWidth: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} elevation={2}>
          <h3>
            Моделирование процесса распределения портфеля заказов
          </h3>
          <Link sx={{ textDecoration: 'none', margin: '10px 0' }} href="/task2/creation">
            <Button color="primary" variant="outlined">
              Создать игру
            </Button>
          </Link>
          <Link sx={{ textDecoration: 'none', margin: '10px 0' }} href="/task2/connect">
            <Button color="primary" variant="outlined">
              Присоединиться к игре
            </Button>
          </Link>
        </Paper>
      </div>
  )
}

export default Task1;
