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
  TextField
} from "@mui/material";
import Participant from "../../components/Task1/Participant";
import Timer from "../../components/Task1/Timer";
import {API_ENDPOINT} from "../../constants";

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
      <Paper sx={{ padding: 2, paddingBottom: 10, width: '100%' }}>
        <Participant
          order={data?.order}
          evaluations={data?.evaluations}
          results={data?.results}
          cost={data?.cost}
          >
          <Box>
            {data?.roomStarted && !data?.roomFinished ? (
              <>
                <h4>Текущий шаг: {data?.currentStep}</h4>
                <h4>До следующего шага: <Timer finishAt={data?.nextTickAt || 0} /></h4>
                {
                  (data?.evaluations || []).length !== data?.currentStep ? (
                    <>
                      {
                        data?.initValuePassed ? (
                          <Box sx={{ display: 'flex', margin: -1 }}>
                            <Button onClick={() => {
                              mutation.mutate({ decision: "down", initValue: 0 });
                            }} sx={{ margin: 1, width: 100 }} variant="contained" color="error">Понизить оценку</Button>
                            <Button onClick={() => {
                              mutation.mutate({ decision: "equal", initValue: 0 });
                            }} sx={{ margin: 1, width: 100 }} variant="contained" color="secondary">Не менять оценку</Button>
                            <Button onClick={() => {
                              mutation.mutate({ decision: "up", initValue: 0 });
                            }} sx={{ margin: 1, width: 100 }} variant="contained" color="success">Повысить оценку</Button>
                          </Box>
                        ) : (
                          <FormGroup>
                            <FormControl onBlur={() => {
                              setInitValue(prev => `${parseFloat(prev) || ''}`)
                            }} sx={{ marginTop: 2, marginBottom: 2, width: 300 }}>
                              <FormLabel>Начальная оценка</FormLabel>
                              <TextField variant="outlined" onChange={e => setInitValue(e.target.value)} value={initValue}  name="roomId" id="my-input" aria-describedby="my-helper-text"/>
                            </FormControl>
                            <FormControl sx={{ marginTop: 2, marginBottom: 2, width: 300 }}>
                              <Button onClick={() => {
                                mutation.mutate({ initValue: parseFloat(`${initValue || 0}`) })
                              }} variant="contained">Подтвердить</Button>
                            </FormControl>
                          </FormGroup>
                        )
                      }
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress sx={{ marginRight: 2 }} />
                      <h4>Ваше решение принято. Пожалуйста, дождитесь следующего шага...</h4>
                    </Box>
                  )
                }
              </>
            ) : (
              <h4>Игра завершена</h4>
            )}
          </Box>
        </Participant>
      </Paper>
    </Container>
  )
}

export default RoomPlayer;
