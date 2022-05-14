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
  TextField, Typography, useTheme
} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import axios from "axios";

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
  const query = useQuery(`task1CenterInfo${token}`, () => {
    return axios(`http://localhost:8080/getInfoForCenter?token=${token}`, {
      method: 'get',
    })
  }, {
    refetchInterval: 1000,
  });

  const mutation = useMutation(`task1PlayersSettings${token}`, ({ settings, initValues }: any) => {
    return axios(`http://localhost:8080/setUsers`, {
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

  const theme = useTheme();

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
      <Paper sx={{ width: '100%', backgroundColor: '#f3f3f3', overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, marginBottom: 2, padding: 2 }}>
          <Typography style={{ color: 'white', fontSize: 22 }}>Моделирование процесса финансирования совместного проекта</Typography>
        </Box>
        <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
          <Box sx={{ backgroundColor: '#545454', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
            <Typography style={{ color: 'white', fontSize: 16 }}>Настроить затраты участников</Typography>
          </Box>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            {query.data?.data.users.map((item: any, i: number) => (
              <FormItemMemo userId={item.id} value={spending[item.order]} setSpending={setSpending} index={`${item.order}`} key={item.order} />
            ))}
          </FormGroup>
        </Box>
        {
          query.data?.data.roomType === 'imitation' && (
            <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
              <Box sx={{ backgroundColor: '#545454', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
                <Typography style={{ color: 'white', fontSize: 16 }}>Настроить первичные оценки участников участников</Typography>
              </Box>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                {query.data?.data.users.map((item: any, i: number) => (
                  <FormItemInitMemo userId={item.id} value={spending[item.order]} setSpending={setSpending} index={`${item.order}`} key={item.order} />
                ))}
              </FormGroup>
            </Box>
          )
        }
        <Box sx={{ marginTop: 2, backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2}}>
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
                router.push('/task1/room?token=' + token);
              }
            })
          }} variant="contained">Начать игру</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default PlayersSettings;