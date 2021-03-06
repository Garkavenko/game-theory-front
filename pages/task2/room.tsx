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
import {API_ENDPOINT} from "../../constants";
import Block from "../../components/common/Block";
import {LineWithCirclePoint} from "../../components/common/charts/helpers";
import UsersData from "../../components/Task2/UsersData";
import Profit from "../../components/common/Profit";
import ParticipantGameInfo from "../../components/common/ParticipantGameInfo";
import CustomTimer from "../../components/common/CustomTimer";

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
    return axios(`${API_ENDPOINT}/task2/getInfoForCenter?token=` + token, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  });

  const setUserCanSeeMutation = useMutation(`setUserCanSee`, ({ canSee, order }: { canSee: boolean, order: number }) => {
    return axios(`${API_ENDPOINT}/task2/setUserSeeAbility`, {
      method: 'post',
      data: {
        canSee,
        userOrder: order,
        token,
      }
    })
  });

  const mutation = useMutation(`stopRoom${token}`, () => {
    return axios(`${API_ENDPOINT}/task2/stopRoom?token=` + token, {
      method: 'post',
    })
  })
  /* @ts-ignore */
  const chartData = useMemo(() => query.data?.data?.results?.map((r, i) => ({
    value: r,
    index: i + 1,
  })), [query.data?.data?.results]);
  const theme = useTheme();
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
          <Typography style={{ color: 'white', fontSize: 22 }}>?????????????????????????? ???????????????? ?????????????????????????? ???????????????? ??????????????</Typography>
        </Box>

        <Block title="????????">
          {!query.data?.data?.finished ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Profit curr={query.data?.data?.results[query.data?.data?.results.length - 1]} prev={query.data?.data?.results[query.data?.data?.results.length - 2]} />
                <Box sx={{ display: 'flex' }}>
                  <ParticipantGameInfo currentStep={query.data?.data?.currentStep} />
                  <Box sx={{ marginRight: 2 }}>
                    <CustomTimer nextTickAt={query.data?.data?.nextTickAt || 0} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button variant="contained" color="error" onClick={() => {
                      mutation.mutate();
                    }}>?????????????????? ????????</Button>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <Typography sx={{ fontWeight: 'bold', color: '#f44336' }}>
              ???????? ??????????????????
            </Typography>
          )}
        </Block>
        <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
          <Box sx={{ backgroundColor: '#8e8e8e', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
            <Typography style={{ color: 'white', fontSize: 16 }}>???????????? ?????????????? ?????????????? ????????????</Typography>
          </Box>
          {/* @ts-ignore */}
          <Chart
            data={chartData}
            height={300}
          >
            <ArgumentAxis />
            <ValueAxis showTicks />

            <LineSeries seriesComponent={LineWithCirclePoint} valueField="value" argumentField="index" />
            <EventTracker />
            {/* @ts-ignore */}
            <Tooltip targetItem={target} onTargetItemChange={setTarget} />
          </Chart>
        </Box>
        <UsersData lambdas={query.data?.data?.lambdas} users={query.data?.data?.users} onUserCanSee={(order, canSee) => {
          setUserCanSeeMutation.mutate({
            canSee: canSee,
            order: order,
          })
        }} centerResults={query.data?.data?.results} />
      </Paper>
    </Container>
  )
}

export default Room;
