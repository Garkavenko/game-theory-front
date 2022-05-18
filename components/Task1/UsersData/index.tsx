import React, {useMemo, useState} from "react";
import {
  Box,
  Checkbox,
  FormControlLabel, styled,
  Table,
  TableBody, TableCell, tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {ArgumentAxis, Chart, Legend, LineSeries, Tooltip, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {colors, LineWithCirclePoint} from "../../common/charts/helpers";
import {EventTracker} from "@devexpress/dx-react-chart";
import Block from "../../common/Block";
import {round} from "lodash";

interface UsersDataProps {
  users: any[];
  onUserCanSee?: (order: number, canSee: boolean) => void;
  centerResults: number[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
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

function UsersData({
  users,
  onUserCanSee,
  centerResults,
}: UsersDataProps) {
  const [allUsersTarget, setAllUsersTarget] = useState();
  const allUsersResultsChartData = useMemo(() => centerResults?.map((r, i) => ({
    index: i + 1,
    ...(users?.reduce((acc:any, item:any, idx: number) => {
      return {
        ...acc,
        [`user${idx}r`]: round(item.results[i], 1),
        [`user${idx}e`]: round(item.evaluations[i], 1),
      }
    }, {})),
  })), [users, centerResults]);

  const winnerIdx = useMemo(() => users?.reduce((acc: any, item: any, idx: number) => {
    if (acc === -1) {
      return idx;
    }
    console.log(idx, users[idx]?.results?.[users[idx]?.results?.length - 1], users[acc]?.results[users[acc]?.results?.length - 1]);
    if (users[idx]?.results?.[users[idx]?.results?.length - 1] > users[acc]?.results[users[acc]?.results?.length - 1]) {
      return idx;
    }
    return acc;
  }, -1), [users]);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
        <Box sx={{ backgroundColor: '#545454', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
          <Typography style={{ color: 'white', fontSize: 16 }}>График оценок участников</Typography>
        </Box>
        {/* @ts-ignore */}
        <Chart
          data={allUsersResultsChartData}
          height={300}
        >
          <ArgumentAxis />
          <ValueAxis showTicks />
          {
            users?.map((u, i) => (
              <LineSeries seriesComponent={LineWithCirclePoint} name={`Участник ${u.order}`} valueField={`user${i}e`} argumentField="index" color={colors[i % colors.length]} />
            ))
          }
          <EventTracker />
          {/* @ts-ignore */}
          <Tooltip targetItem={allUsersTarget} onTargetItemChange={setAllUsersTarget} />
          <Legend />
        </Chart>
      </Box>
      <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
        <Box sx={{ backgroundColor: '#545454', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1 }}>
          <Typography style={{ color: 'white', fontSize: 16 }}>График значений участников</Typography>
        </Box>
        {/* @ts-ignore */}
        <Chart
          data={allUsersResultsChartData}
          height={300}
        >
          <ArgumentAxis />
          <ValueAxis showTicks />
          {
            users?.map((u, i) => (
              <LineSeries seriesComponent={LineWithCirclePoint} name={`Участник ${u.order}`} valueField={`user${i}r`} argumentField="index" color={colors[i % colors.length]} />
            ))
          }
          <EventTracker />
          {/* @ts-ignore */}
          <Tooltip targetItem={allUsersTarget} onTargetItemChange={setAllUsersTarget} />
          <Legend />
        </Chart>
      </Box>
      <Box>
        <Block title="Таблица результатов">
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell colSpan={2}>Центр</StyledTableCell>
                  {users?.map((i:any, id: any) => (
                    <>
                      <StyledTableCell key={id} align="left" colSpan={2}>
                        <div>
                          Участник №{id + 1}
                          {
                            id === winnerIdx && (
                              <Box sx={{ marginRight: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#87e8de', backgroundColor: '#e6fffb', borderRadius: 1, padding: 0.2 }}>
                                <Typography sx={{ color: '#08979c', fontSize: 10 }}>Выигрывает</Typography>
                              </Box>
                            )
                          }
                          {!!onUserCanSee && (
                            <Box>
                              <FormControlLabel
                                label="Полный доступ"
                                sx={{'& .MuiFormControlLabel-label': {fontSize: 12}}}
                                control={
                                  <Checkbox onChange={event => {
                                    onUserCanSee(i.order, event.target.checked);
                                  }} color="secondary" sx={{'& .MuiSvgIcon-root': {color: 'white'}}}/>
                                }
                              />
                            </Box>
                          )}
                        </div>
                      </StyledTableCell>
                    </>
                  ))}
                </TableRow>
                <TableRow>
                  <StyledTableCell sx={{ position: 'sticky', left: 0, top: !!onUserCanSee ? 119 : 77.2, zIndex: 99999 }}>Шаг</StyledTableCell>
                  <StyledTableCell sx={{ top: !!onUserCanSee ? 119 : 77.2, }} align="right">Значение цели</StyledTableCell>
                  {users?.map((i:any, id: any) => (
                    <React.Fragment key={id}>
                      <StyledTableCell sx={{ top: !!onUserCanSee ? 119 : 77.2, }} align="right">Оценка</StyledTableCell>
                      <StyledTableCell sx={{ top: !!onUserCanSee ? 119 : 77.2, }} align="right">Значение цели</StyledTableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {([...centerResults].reverse()).map((r, i) => (
                  <StyledTableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell sx={{ position: 'sticky', left: 0, backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'white' }} component="th" scope="row">
                      {(centerResults?.length || 0) - i}
                    </StyledTableCell>
                    <StyledTableCell align="right">{round(r, 1)}</StyledTableCell>
                    {users?.map((u, ui) => (
                      <>
                        <StyledTableCell sx={{ color: colors[ui % colors.length] }} component="th" scope="row">
                          {round(u.evaluations[centerResults?.length - i - 1], 1)}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: colors[ui % colors.length] }} align="right">
                          {round(u.results[centerResults?.length - i - 1], 1)}
                        </StyledTableCell>
                      </>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Block>
      </Box>
    </>
  )
}

export default UsersData;
