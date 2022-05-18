import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
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
import Participant from "../../components/Task2/Participant";
import Timer from "../../components/Task1/Timer";
import {API_ENDPOINT} from "../../constants";
import Block from "../../components/common/Block";

function RoomPlayer() {
  const token = useRouter().query.token;
  const [initValue, setInitValue] = useState('');
  const query = useQuery(`task1ParticipantInfo${token}`, () => {
    return axios(`${API_ENDPOINT}/task2/getInfoForParticipant?token=${token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: !!token && 1000,
  });

  const mutation = useMutation(`makeDecision${token}`, ({ decision, initValue }: any) => {
    return axios(`${API_ENDPOINT}/task2/setUserDecision`, {
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
          <Typography style={{ color: 'white', fontSize: 22 }}>Моделирование процесса распределения портфеля заказов</Typography>
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
          lambdas={data?.lambdas}
          currentStep={data?.currentStep}
        >
          <Block title="Игра" titleColor="green">
            {data?.roomStarted && !data?.roomFinished ? (
              <>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ marginRight: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#91d5ff', backgroundColor: '#e6f7ff', borderRadius: 1, padding: 0.5 }}>
                    <Typography sx={{ color: '#096dd9' }}>Значение затрат: <b>{data?.cost}</b></Typography>
                  </Box>
                  <Box sx={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#87e8de', backgroundColor: '#e6fffb', borderRadius: 1, padding: 0.5 }}>
                    <Typography sx={{ color: '#08979c' }}>Текущая оценка: <b>{data?.evaluations?.[(data?.evaluations?.length) - 1] || '-'}</b></Typography>
                  </Box>
                </Box>
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
                            }} sx={{ marginTop: 2, marginBottom: 2, width: 300 }}>
                              <FormLabel>Введите оценку</FormLabel>
                              <TextField variant="outlined" onChange={e => setInitValue(e.target.value)} value={initValue}  name="roomId" id="my-input" aria-describedby="my-helper-text"/>
                            </FormControl>
                            <FormControl sx={{ marginTop: 2, marginBottom: 2, width: 300 }}>
                              <Button onClick={async () => {
                                await mutation.mutateAsync({ initValue: parseFloat(`${initValue || 0}`) });
                              }} variant="contained">Подтвердить</Button>
                            </FormControl>
                          </FormGroup>
                        )
                      }
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress sx={{ marginRight: 2 }} />
                      <Typography>Ваше решение принято. Пожалуйста, дождитесь следующего шага...</Typography>
                    </Box>
                  )
                }
              </>
            ) : (
              <h4>Игра завершена</h4>
            )}
          </Block>
        </Participant>
      </Paper>
    </Container>
  )
}

export default RoomPlayer;
