import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  makeStyles,
  Paper,
  TextField
} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {API_ENDPOINT} from "../../constants";

interface FormItemProps {
  setSpending: Dispatch<SetStateAction<Record<string, { userId: number, cost: string, initValue: string }>>>;
  value: { userId: number, cost: string, initValue: string };
  index: string;
  userId: number;
}

function FormItem({ setSpending, value, index, userId }: FormItemProps) {
  return (
    <FormControl onBlur={() => {
      setSpending(prev => ({ ...prev, [index]: { ...prev[index], userId, cost: `${parseFloat(prev[index]?.cost) || ''}` } }))
    }} sx={{ width: 120, margin: 2 }}>
      <FormLabel>Затраты участника #{parseInt(index, 10)}</FormLabel>
      <TextField value={value?.cost || ''} onChange={e => setSpending(prev => ({ ...prev, [index]: { ...prev[index], userId, cost: e.target.value } }))} />
    </FormControl>
  )
}

const FormItemMemo = React.memo(FormItem);

function FormItemInit({ setSpending, value, index, userId }: FormItemProps) {
  return (
    <FormControl onBlur={() => {
      setSpending(prev => ({ ...prev, [index]: { ...prev[index], userId, initValue: `${parseFloat(prev[index]?.initValue || prev[index]?.cost) || ''}` } }))
    }} sx={{ width: 120, margin: 2 }}>
      <FormLabel>Первичная оценка участника #{parseInt(index, 10)}</FormLabel>
      <TextField value={value?.initValue === undefined ? value?.cost : (value?.initValue || '')} onChange={e => setSpending(prev => ({ ...prev, [index]: { ...prev[index], userId, initValue: e.target.value } }))} />
    </FormControl>
  )
}

const FormItemInitMemo = React.memo(FormItemInit);

function PlayersSettings() {
  const router = useRouter();
  const token = router.query.token;
  console.log(token);
  const query = useQuery(`task2CenterInfo${token}`, () => {
    return axios(`${API_ENDPOINT}/getInfoForCenter?token=${token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  });

  const mutation = useMutation(`task2PlayersSettings${token}`, ({ settings, initValues }: any) => {
    return axios(`${API_ENDPOINT}/task2/setUsers`, {
      method: 'post',
      data: {
        token,
        settings,
        initValues,
      }
    })
  })
  const [spending, setSpending] = useState<Record<string, { userId: number, cost: string, initValue: string }>>({});
  console.log(!query.data?.data?.roomId);
  if (query.isLoading || !query.data?.data?.roomId) {
    return (
      <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
        <Paper sx={{ padding: 2 }}>
          <CircularProgress />
        </Paper>
      </Container>
    )
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
      <Paper sx={{ padding: 2 }}>
        <h1>Моделирование процесса распределения портфеля заказов</h1>
        <h2>Настроить затраты участников</h2>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
          {query.data?.data.users.map((item: any, i: number) => (
            <FormItemMemo userId={item.id} value={spending[item.order]} setSpending={setSpending} index={`${item.order}`} key={item.order} />
          ))}
        </FormGroup>
        {
          query.data?.data.roomType === 'imitation' && (
            <>
              <h2>Настроить первичные оценки участников участников</h2>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                {query.data?.data.users.map((item: any, i: number) => (
                  <FormItemInitMemo userId={item.id} value={spending[item.order]} setSpending={setSpending} index={`${item.order}`} key={item.order} />
                ))}
              </FormGroup>
            </>
          )
        }
        <Box sx={{ marginTop: 2 }}>
          <Button onClick={() => {
            mutation.mutate(Object.keys(spending).reduce<{ settings: { userId: number, value: number }[], initValues: { userId: number, value: number }[] }>((acc, item) => {
              return {
                ...acc,
                settings: [
                  ...acc.settings,
                  {
                    userId: spending[item].userId,
                    value: parseFloat(spending[item].cost),
                  }
                ],
                initValues: [
                  ...acc.initValues,
                  {
                    userId: spending[item].userId,
                    value: parseFloat(spending[item].initValue || spending[item].cost),
                  }
                ]
              }
            }, { settings: [], initValues: [] }), {
              onSuccess: () => {
                router.push('/task2/room?token=' + token);
              }
            })
          }} variant="contained">Начать игру</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default PlayersSettings;
