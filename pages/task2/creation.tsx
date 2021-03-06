import {
  Box,
  Button,
  Container, Divider,
  FormControl, FormControlLabel,
  FormGroup,
  FormLabel,
  Paper, Radio,
  RadioGroup, TextField, Typography, useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {useRouter} from "next/router";
import axios from "axios";
import {API_ENDPOINT} from "../../constants";

interface FormItemProps {
  children: React.ReactNode,
  align?: 'vertical' | 'horizontal'
}
function FormItem({ children, align }: FormItemProps) {
  return (
    <Box sx={{ marginBottom: 2, ...(align === 'horizontal' ? { display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' } : {} ) }}>
      {children}
    </Box>
  )
}

const INPUT_WIDTH = 150;

function Creation() {

  const mutation = useMutation('createTask1Room', ({ method, penalty, step, resource, roomType, usersNumber, stepsCount }: any) => {
    return axios(`${API_ENDPOINT}/task2/createRoom`, {
      method: 'post',
      data: {
        priorityMethod: method,
        penalty: parseFloat(penalty) || 0,
        step: parseFloat(step) || 0,
        resource: parseFloat(resource) || 0,
        roomType,
        usersNumber: parseInt(usersNumber) || 0,
        stepsCount: parseInt(stepsCount) || 1,
      }
    })
  })

  const [roomType, setRoomType] = useState("imitation");
  const [usersNumber, setUsersNumber] = useState("");
  const [method, setMethod] = useState("4");
  const [penalty, setPenalty] = useState("");
  const [step, setStep] = useState("");
  const [resource, setResource] = useState("");
  const [stepsCount, setStepsCount] = useState("1");
  const router = useRouter();


  useEffect(() => {
    (async () => {
      if (mutation.isSuccess) {
        const response = mutation.data.data;
        if (roomType === 'imitation') {
          router.push(`/task2/playersSettings?token=${response.token}`);
        } else {
          router.push(`/task2/waiting?token=${response.token}`);
        }
      }
    })()
  }, [mutation.isSuccess])

  const theme = useTheme();
  return (
    <Container sx={{ display: 'flex', marginTop: 2 }}>
      <Paper sx={{ padding: 2, width: '100%' }}>
        <Box sx={{ backgroundColor: theme.palette.primary.main, margin: -2, marginBottom: 2, padding: 2 }}>
          <Typography style={{ color: 'white', fontSize: 22 }}>?????????????????????????? ???????????????? ?????????????????????????? ???????????????? ??????????????</Typography>
        </Box>
        <FormGroup>
          <FormItem>
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <FormLabel sx={{ marginRight: 2 }}>???????????????? ?????? ??????????????????????????</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="imitation"
                value={roomType}
                sx={{ display: 'flex', flexDirection: 'row' }}
                onChange={e => setRoomType(e.target.value)}
                name="radio-buttons-group"
              >
                <FormControlLabel value="imitation" control={<Radio />} label="????????????????????????" />
                <FormControlLabel value="gaming" control={<Radio />} label="??????????????" />
              </RadioGroup>
            </FormControl>
          </FormItem>
          <FormItem>
            <FormControl>
              <FormLabel>???????????????? ?????????? ??????????????????????</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="4"
                value={method}
                onChange={e => setMethod(e.target.value)}
                name="radio-buttons-group"
              >
                <FormControlLabel value="4" control={<Radio />} label="???????????????????????????????? ???????????????? ????????????" />
              </RadioGroup>
            </FormControl>
          </FormItem>
          <FormItem align="horizontal">
            <FormControl onBlur={() => {
              setPenalty(prev => `${parseFloat(prev) || ''}`)
            }} sx={{ width: INPUT_WIDTH, marginRight: 2 }}>
              <FormLabel>?????????????????????? ??????????????</FormLabel>
              <TextField variant="outlined" onChange={e => setPenalty(e.target.value)} value={penalty}  name="shtraf" id="my-input" aria-describedby="my-helper-text"/>
            </FormControl>
            <FormControl onBlur={() => {
              setStep(prev => `${parseFloat(prev) || ''}`)
            }} sx={{ width: INPUT_WIDTH, marginRight: 2 }}>
              <FormLabel>?????? ?????????????????? ????????????</FormLabel>
              <TextField value={step} name="step" id="my-input" onChange={e => setStep(e.target.value)} aria-describedby="my-helper-text"/>
            </FormControl>
            <FormControl onBlur={() => {
              setResource(prev => `${parseFloat(prev) || ''}`)
            }} sx={{ width: INPUT_WIDTH, marginRight: 2 }}>
              <FormLabel>???????????????????? ????????????????</FormLabel>
              <TextField value={resource} name="resource" onChange={e => setResource(e.target.value)} aria-describedby="my-helper-text"/>
            </FormControl>
            {roomType === 'imitation' && (
              <>
                <FormControl onBlur={() => {
                  setUsersNumber(prev => `${parseFloat(prev) || ''}`)
                }} sx={{ width: INPUT_WIDTH, marginRight: 2}}>
                  <FormLabel>???????????????????? ??????????????</FormLabel>
                  <TextField value={usersNumber} name="usersNumber" onChange={e => setUsersNumber(e.target.value)}
                             aria-describedby="my-helper-text"/>
                </FormControl>
                <FormControl onBlur={() => {
                  setStepsCount(prev => `${parseFloat(prev) || ''}`)
                }} sx={{ width: INPUT_WIDTH, marginRight: 2}}>
                  <FormLabel>???????????????????? ??????????</FormLabel>
                  <TextField value={stepsCount} name="setStepsCount" onChange={e => setStepsCount(e.target.value)}
                             aria-describedby="my-helper-text"/>
                </FormControl>
              </>
            )}
          </FormItem>
          <FormControl>
            <Button onClick={() => {
              mutation.mutate({
                method,
                penalty,
                step,
                resource,
                roomType,
                usersNumber,
                stepsCount,
              })
            }} type="submit" variant="contained">?????????????? ??????????????</Button>
          </FormControl>
        </FormGroup>
      </Paper>
    </Container>
  )
}

export default Creation;
