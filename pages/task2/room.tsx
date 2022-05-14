import React, {useEffect, useMemo, useState} from 'react';

import {
  Accordion, AccordionDetails, AccordionSummary,
  Box, Button,
  CircularProgress, Collapse,
  Container,
  Divider,
  Paper, styled,
  Table,
  TableBody,
  TableCell, tableCellClasses, TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import {EventTracker} from "@devexpress/dx-react-chart";
import {useMutation, useQuery} from "react-query";
import {useRouter} from "next/router";
import axios from "axios";
import Participant from "../../components/Task1/Participant";
import Timer from "../../components/Task1/Timer";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Room() {
  const router = useRouter()
  const token = router.query.token;
  const [target, setTarget] = useState();
  const query = useQuery(`roomInfo${token}`, () => {
    return axios('http://localhost:8080/task2/getInfoForCenter?token=' + token, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  });

  const mutation = useMutation(`stopRoom${token}`, () => {
    return axios('http://localhost:8080/task2/stopRoom?token=' + token, {
      method: 'post',
    })
  })

  const chartData = useMemo(() => query.data?.data?.results?.map((r, i) => ({
    value: r,
    index: i + 1,
  })), [query.data?.data?.results]);

  if (query.isLoading || !query.data?.data) {
    return (
      <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
        <Paper sx={{ padding: 2 }}>
          <CircularProgress />
        </Paper>
      </Container>
    )
  }
  console.log(query.data?.data?.nextStepAfter || 0);
  return (
    <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
      <Paper sx={{ padding: 2, paddingBottom: 10 }}>
        <h1>Моделирование процесса распределения портфеля заказов</h1>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Box>
          {!query.data?.data?.finished ? (
            <>
              <Button variant="contained" onClick={() => {
                mutation.mutate();
              }}>Завершить игру</Button>
              <h4>Текущий шаг: {query.data?.data?.currentStep}</h4>
              <h4>До следующего шага: <Timer finishAt={query.data?.data?.nextTickAt || 0} /></h4>
            </>
          ) : (
            <h4>Игра завершена</h4>
          )}
        </Box>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <h3>График целевой функции центра</h3>
        <Box>
          <Chart
            data={chartData}
            height={300}
          >
            <ArgumentAxis />
            <ValueAxis showTicks />

            <LineSeries valueField="value" argumentField="index" />
            <EventTracker />
            <Tooltip targetItem={target} onTargetItemChange={setTarget} />
          </Chart>
          <h4>Значения функции цели</h4>
          <Box sx={{ height: 400, width: 300, overflow: 'auto' }}>
            <TableContainer>
            <Table sx={{ overflow: 'auto' }} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Шаг</StyledTableCell>
                  <StyledTableCell align="right">Значение цели</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {([...query.data?.data?.results].reverse()).map((r, i) => (
                  <StyledTableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {(query.data?.data?.results?.length || 0) - i}
                    </StyledTableCell>
                    <StyledTableCell align="right">{r}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </Box>
        </Box>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Box>
          {query.data?.data?.users?.map((u) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
              >
                <Typography>
                  Данные участника #{u.order}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Participant order={u.order} cost={u.cost} results={u.results} evaluations={u.evaluations} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Container>
  )
}

export default Room;
