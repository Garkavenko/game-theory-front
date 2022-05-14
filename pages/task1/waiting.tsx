import {Button, CircularProgress, Container} from "@mui/material";
import {useMutation, useQuery} from "react-query";
import {useRouter} from "next/router";
import axios from "axios";

function Waiting() {
  const router = useRouter();
  const token = router.query.token;
  const mutation = useMutation(`finishTask1Registration${token}`, () => {
    return axios('http://localhost:8080/finishRegistration', {
      method: 'post',
      data: {
        token
      }
    })
  });

  const query = useQuery(`roomParticipantsInfo${token}`, () => {
    return axios(`http://localhost:8080/roomParticipantsInfo?token=${router.query.token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  })
  return (
      <Container style={{ backgroundColor: '#fff', height: '100%' }}>
        <h1>Моделирование процесса финансирования совместного проекта</h1>
        <div>
          <div>
            <h3>Ожидание участников</h3>
            <h3>
              Номер комнаты: {query.data?.data.roomId}
            </h3>
            <h3>
              Подключено: {query.data?.data.count}
            </h3>
            <CircularProgress />
          </div>
        </div>
        <Button onClick={() => {
          mutation.mutate(undefined, {
            onSuccess: () => {
              router.push(`/task1/playersSettings?token=${token}`)
            }
          });
        }} sx={{ marginTop: 3 }} variant="contained">Завершить подключение участников и настроить значения для каждого участника</Button>
      </Container>
  )
}

export default Waiting;
