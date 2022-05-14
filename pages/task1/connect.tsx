import {useEffect, useState} from "react";
import {Button, Container, Divider, FormControl, FormGroup, FormLabel, Paper, TextField} from "@mui/material";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {useRouter} from "next/router";
import {API_ENDPOINT} from "../../constants";


function Connect() {
  const [token, setToken] = useState('');
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const mutation = useMutation(`task1Connect${roomId}`, () => {
    return axios(API_ENDPOINT + '/connectUser', {
      method: 'post',
      data: {
        roomId: parseInt(roomId, 10) || 0,
      }
    })
  });

  const query = useQuery(`task1ParticipantInfo${token}`, () => {
    return axios(`${API_ENDPOINT}/getInfoForParticipant?token=${token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: !!token && 1000,
  });

  useEffect(() => {
    if (query.data?.data?.roomStarted && token) {
      router.push('/task1/roomPlayer?token=' + token);
    }
  }, [query.data?.data?.roomStarted, token]);

  if (query.data?.data) {
    return (
      <Container sx={{ display: 'flex', marginTop: 2 }}>
        <Paper sx={{ padding: 2, width: '100%' }}>
          <h3>Участник #{query.data?.data.order}</h3>
          <h3>Вы успешно подключились к комнате {roomId}</h3>
          <h3>Ожидаем начала игры...</h3>
        </Paper>
      </Container>
    )
  }

  return (
    <Container sx={{ display: 'flex', marginTop: 2 }}>
      <Paper sx={{ padding: 2, width: '100%' }}>
        <FormGroup>
          <FormControl onBlur={() => {
            setRoomId(prev => `${parseInt(prev) || ''}`)
          }} sx={{ marginTop: 2, marginBottom: 2, width: 300 }}>
            <FormLabel>Номер комнаты</FormLabel>
            <TextField variant="outlined" onChange={e => setRoomId(e.target.value)} value={roomId}  name="roomId" id="my-input" aria-describedby="my-helper-text"/>
          </FormControl>
          <Divider />
          <FormControl>
            <Button onClick={() => {
              mutation.mutate(undefined, {
                onSuccess: (res) => {
                  setToken(res.data.token);
                }
              })
            }}>
              Подключиться
            </Button>
          </FormControl>
        </FormGroup>
      </Paper>
    </Container>
  )
}

export default Connect;
