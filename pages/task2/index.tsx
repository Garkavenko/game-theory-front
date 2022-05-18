import {Box, Button, Container, Link, Paper, Typography, useTheme} from "@mui/material";
import Head from "next/head";
import React, {useEffect, useState} from "react";
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

  const theme = useTheme();

  if (!loaded) {
    return null;
  }

  return (
    <Container sx={{ display: 'flex', marginTop: 2 }}>
      <Paper sx={{ padding: 2, width: '100%' }}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, margin: -2, marginBottom: 2, padding: 2 }}>
          <Typography style={{ color: 'white', fontSize: 22 }}>Моделирование процесса распределения портфеля заказов</Typography>
        </Box>
        <Link sx={{ textDecoration: 'none', marginRight: 2, marginBottom: 2 }} href="/task2/creation">
          <Button color="primary" variant="contained">
            Создать игру
          </Button>
        </Link>
        <Link sx={{ textDecoration: 'none', margin: '10px 0' }} href="/task2/connect">
          <Button color="secondary" variant="contained">
            Присоединиться к игре
          </Button>
        </Link>
      </Paper>
    </Container>
  )
}

export default Task1;
