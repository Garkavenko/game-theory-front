import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useRouter} from "next/router";
import {symbol, symbolTriangle} from "d3-shape";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {round} from 'lodash';
import Triangle from './triangle.svg';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  Paper,
  TextField, Typography, useTheme
} from "@mui/material";
import Participant from "../../components/Task1/Participant";
import Timer from "../../components/Task1/Timer";
import Block from "../../components/common/Block";
import {API_ENDPOINT} from "../../constants";
import ParticipantGameInfo from "../../components/common/ParticipantGameInfo";
import {LineWithCirclePoint} from "../../components/common/charts/helpers";
import {ArgumentAxis, Chart, LineSeries, Tooltip, ValueAxis } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import CurrentEval from "../../components/CurrentEval";
import CustomTimer from "../../components/common/CustomTimer";
import Profit from "../../components/common/Profit";

function RoomPlayer() {
  const token = useRouter().query.token;
  const [initValue, setInitValue] = useState('');
  const query = useQuery(`task1ParticipantInfo${token}`, () => {
    return axios(`${API_ENDPOINT}/getInfoForParticipant?token=${token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: !!token && 1000,
  });

  const mutation = useMutation(`makeDecision${token}`, ({ decision, initValue }: any) => {
    return axios(API_ENDPOINT + '/setUserDecision', {
      method: 'post',
      data: {
        token,
        decision: decision || "",
        initValue,
      },
    })
  });

  const data = query.data?.data;

  useEffect(() => {
    if (data?.const) {
      setInitValue(`${data?.cost}`)
    }
  }, [data?.cost]);

  useEffect(() => {
    setInitValue('');
  }, [data?.currentStep])

  const theme = useTheme();
  const resultsChart = useMemo(() => data?.results?.map((r, i) => ({ step: i+ 1, value: r })), [data?.results]);
  const [resultsTarget, setResultsTarget] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const onButtonClick = useCallback(async () => {
    setButtonLoading(true);
    await mutation.mutateAsync({ initValue: parseFloat(`${initValue || 0}`) || 0 });
  }, [mutation, initValue]);

  useEffect(() => {
    setButtonLoading(false);
  }, [data?.currentStep]);

  if (query.isLoading || !query.data?.data) {
    return (
      <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
        <Paper sx={{ padding: 2, paddingBottom: 10 }}>
          <CircularProgress />
        </Paper>
      </Container>
    )
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
      <Paper sx={{ paddingBottom: 10, width: '100%', backgroundColor: '#f3f3f3' }}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, marginBottom: 2, padding: 2 }}>
          <Typography style={{ color: 'white', fontSize: 22 }}>Моделирование процесса финансирования совместного проекта</Typography>
        </Box>
        <Participant
          order={data?.order}
          evaluations={data?.evaluations}
          results={data?.results}
          cost={data?.cost}
          canSeeOthers={data?.canSeeOthers}
          users={data?.users}
          centerResults={data?.roomResults}
          nextTickAt={data?.nextTickAt}
          currentStep={data?.currentStep}
          >
          <Block title={`Игра (Участник №${data?.order})`}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ width: 300, justifyContent: 'space-between', display: 'flex', flexDirection: 'column', borderWidth: 1, borderStyle: 'solid', borderColor: '#91d5ff', backgroundColor: '#f7fcff', borderRadius: 1, padding: 0.5 }}>
                  <>
                    <Box>
                      <Box sx={{ marginBottom: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#91d5ff', backgroundColor: '#f7fcff', borderRadius: 1, padding: 0.5 }}>
                        <Typography sx={{ color: '#26366f' }}>Значение затрат: <b>{data?.cost}</b></Typography>
                      </Box>
                      <CurrentEval currentVal={data?.evaluations?.[(data?.evaluations?.length) - 1]} prevVal={data?.evaluations?.[(data?.evaluations?.length) - 2]} />
                    </Box>
                    {data?.roomStarted && !data?.roomFinished ? (
                      <>
                        <CustomTimer nextTickAt={data?.nextTickAt || 0} />
                    {
                      (data?.evaluations || []).length !== data?.currentStep ? (
                        <>
                          {
                            data?.initValuePassed ? (
                              <Box sx={{ display: 'flex', margin: -1 }}>
                                <Button onClick={() => {
                                  mutation.mutate({ decision: "down", initValue: 0 });
                                }} sx={{ margin: 1, width: 150 }} variant="contained" color="error">Понизить оценку</Button>
                                <Button onClick={() => {
                                  mutation.mutate({ decision: "equal", initValue: 0 });
                                }} sx={{ margin: 1, width: 150 }} variant="contained" color="secondary">Не менять оценку</Button>
                                <Button onClick={() => {
                                  mutation.mutate({ decision: "up", initValue: 0 });
                                }} sx={{ margin: 1, width: 150 }} variant="contained" color="success">Повысить оценку</Button>
                              </Box>
                            ) : (
                              <FormGroup>
                                <FormControl onBlur={() => {
                                  setInitValue(prev => `${parseFloat(prev) || ''}`)
                                }} sx={{ marginTop: 2, marginBottom: 1, width: '100%' }}>
                                  <FormLabel sx={{ color: '#096dd9' }}>Введите новую оценку</FormLabel>
                                  <TextField autoComplete={"off"} onKeyPress={e => {
                                    if (e.key === 'Enter' && !buttonLoading) {
                                      onButtonClick();
                                    }
                                  }} variant="outlined" onChange={e => setInitValue(e.target.value)} value={initValue}  name="roomId" id="my-input" aria-describedby="my-helper-text"/>
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                  <Button disabled={buttonLoading} onClick={onButtonClick} variant="outlined">
                                    {!buttonLoading ? 'Подтвердить' : (
                                      <CircularProgress size={30} />
                                    )}
                                  </Button>
                                </FormControl>
                              </FormGroup>
                            )
                          }
                        </>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
                          <CircularProgress />
                          <Typography sx={{ color: '#096dd9', flex: 1 }}>Ваше решение принято. Пожалуйста, дождитесь следующего шага...</Typography>
                        </Box>
                      )
                    }</>) : (
                      <Typography sx={{ color: 'red', flex: 1, fontWeight: 'bold' }}>Игра завершена</Typography>
                    )}
                    {/**/}
                  </>
              </Box>
              <Box sx={{ flex: 1, marginLeft: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Profit curr={data?.results[data?.results.length - 1]} prev={data?.results[data?.results.length - 2]} />
                  <ParticipantGameInfo currentStep={data?.currentStep} />
                </Box>
                {/* @ts-ignore */}
                <Chart
                  data={resultsChart}
                  height={300}
                >
                  <ArgumentAxis />
                  <ValueAxis showTicks />

                  <LineSeries seriesComponent={LineWithCirclePoint} valueField="value" argumentField="step" />
                  <EventTracker />
                  {/* @ts-ignore */}
                  <Tooltip targetItem={resultsTarget} onTargetItemChange={setResultsTarget} />
                </Chart>
              </Box>
            </Box>
          </Block>
        </Participant>
      </Paper>
    </Container>
  )
}

export default RoomPlayer;

