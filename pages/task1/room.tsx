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
  TableRow, Typography, useTheme
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
import Block from "../../components/common/Block";
import {API_ENDPOINT} from "../../constants";

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
    return axios(`${API_ENDPOINT}/getInfoForCenter?token=` + token, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  });

  const mutation = useMutation(`stopRoom${token}`, () => {
    return axios(`${API_ENDPOINT}/stopRoom?token=` + token, {
      method: 'post',
    })
  })
  const theme = useTheme();
  /* @ts-ignore */
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
      <Paper sx={{ paddingBottom: 10, width: '100%', backgroundColor: '#f3f3f3', overflow: 'visible' }}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, marginBottom: 2, padding: 2 }}>
          <Typography style={{ color: 'white', fontSize: 22 }}>Моделирование процесса финансирования совместного проекта</Typography>
        </Box>

        <Block title="Игра" titleColor="green">
          {!query.data?.data?.finished ? (
            <>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ marginRight: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#91d5ff', backgroundColor: '#e6f7ff', borderRadius: 1, padding: 0.5 }}>
                  <Typography sx={{ color: '#096dd9' }}>Текущий шаг: <b>{query.data?.data?.currentStep}</b></Typography>
                </Box>
                <Box sx={{ marginRight: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#87e8de', backgroundColor: '#e6fffb', borderRadius: 1, padding: 0.5 }}>
                  <Typography sx={{ color: '#08979c' }}>До следующего шага: <b><Timer finishAt={query.data?.data?.nextTickAt || 0} /></b></Typography>
                </Box>

                <Button variant="contained" color="error" onClick={() => {
                  mutation.mutate();
                }}>Завершить игру</Button>
              </Box>
            </>
          ) : (
            <Typography sx={{ fontWeight: 'bold', color: '#f44336' }}>
              Игра завершена
            </Typography>
          )}
        </Block>
        <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
          <Box sx={{ backgroundColor: '#545454', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
            <Typography style={{ color: 'white', fontSize: 16 }}>График целевой функции центра</Typography>
          </Box>
          {/* @ts-ignore */}
          <Chart
            data={chartData}
            height={300}
          >
            <ArgumentAxis />
            <ValueAxis showTicks />

            <LineSeries valueField="value" argumentField="index" />
            <EventTracker />
            {/* @ts-ignore */}
            <Tooltip targetItem={target} onTargetItemChange={setTarget} />
          </Chart>
        </Box>
        <Box>
          <Block title="Значения функции цели">
              <TableContainer sx={{ maxHeight: 440, width: 300 }}>
              <Table stickyHeader aria-label="simple table">
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
            </Block>
        </Box>
        <Box>
          {/* @ts-ignore */}
          {query.data?.data?.users?.map((u, i) => (
            <Accordion key={i} sx={{ margin: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                aria-controls="panel1bh-content"
                sx={{  borderRadius: 0, backgroundColor: theme.palette.primary.dark, color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}
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
