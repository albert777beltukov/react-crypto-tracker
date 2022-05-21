import { 
    createTheme,
    ThemeProvider,
    Typography,
    Container,
    TextField,
    TableContainer,
    LinearProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
 } from '@material-ui/core';

import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { CoinList } from '../../config/api';
import { CryptoState } from '../../CryptoContext';

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  

const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch ] = useState('')
    const [page, setPage] = useState(1)

    const {currency, symbol} = CryptoState();

    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: '#16171a',
            cursor: 'pointer',
            "&:hover": {
                backgroundColor: "#131111"
            },
            fontFamily: 'Monsterrat',
        },
        pagination: {
            '& .MuiPaginationItem-root':{
                color: 'gold',
            },
        },
    }));


    const fetchCoins = async () => {
        setLoading(true);
        const {data} = await axios.get(CoinList(currency));

        setCoins(data);
        setLoading(false);

    };
  
    

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const history = useHistory();
    const classes = useStyles();

    const darkTheme = createTheme({
        palette:{
            primary: {
                main: '#FFF'
            },
            type: 'dark',
        },
    });

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search) || 
            coin.symbol.toLowerCase().includes(search)
        ))
    }

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{textAlign: 'center'}}>
            <Typography
            variant='h4'
            style={{margin: 18, fontFamily: 'Monsterrat'}}
            >
                Cryptocurrency Prices by Market Cap
            </Typography>
            <TextField 
            label='Search For a Crypto Currency...'
            variant='outlined'
            style={{marginBottom: 20, width: '100%'}} 
            onChange={(e) => setSearch(e.target.value)}
            />

            <TableContainer>
            {loading ? (
                   <LinearProgress style={{backgroundColor: 'gold'}}/>
               ) : (
                   <Table>
                       <TableHead style={{backgroundColor: '#EEBC1D'}}>
                         <TableRow>
                             {['Coin','Price','24h Change','Market Cap'].map((head) => (
                          <TableCell 
                          style={{
                            color: 'black',
                            fontWeight: '700',
                            fontFamily: 'Monsterrat',
                          }}
                          key={head}
                          align={head === 'Coin' ? '' : 'right'}
                           >
                               {head}
                          </TableCell>
                             ))}
                         </TableRow>
                       </TableHead>



                       <TableBody>
                           {handleSearch()
                           .slice((page - 1) * 10, (page - 1) * 10 + 10)
                           .map((row) => {
                           const profit = row.price_change_percentage_24h > 0;
                           return (
                             <TableRow
                               onClick={() => history.push(`/coins/${row.id}`)} 
                               className={classes.row}
                               key={row.name}
                               >
                                 <TableCell
                                 
                                 component='th'
                                 scope='row'
                                 style={{ display:"flex", gap: 15 }}
                                 >
                                    <img
                                    src={row?.image}
                                    alt={row.name}
                                    height='50'
                                    style={{marginBottom: 10}}>
                                    </img>
                                    <div
                                    style={{display: 'flex', flexDirection: 'column'}}>
                                      <span
                                      style={{textTransform: 'uppercase', fontSize: 22}}
                                      >
                                          {row.symbol}
                                      </span>
                                      <span style={{color: 'darkgray'}}>{row.name}</span>
                                   </div>
                                 </TableCell>
                                 <TableCell align="right">
                                      {symbol}{" "}
                                      {numberWithCommas(row.current_price.toFixed(2))}
                                </TableCell>
                                <TableCell
                                      align="right"
                                      style={{
                                      color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                      fontWeight: 500,
                                     }}
                                    >
                                    {profit && "+"}
                                    {row.price_change_percentage_24h.toFixed(2)}%
                                </TableCell>
                                <TableCell align="right">
                                    {symbol}{" "}
                                    {numberWithCommas(
                                  row.market_cap.toString().slice(0, -6)
                                     )}
                                    M
                                </TableCell>
                                 
                             </TableRow>
                           );
                       })}
                      </TableBody>
                   </Table>
               )}
            </TableContainer>
              <Pagination
               count={(handleSearch()?.length/10).toFixed(0)}
               classes={{ul: classes.pagination}}
               onChange={(_, value) => {
                setPage(value);
                window.scroll(0, 450)
               }}
               style={{
                   padding: 20,
                   width: '100%',
                   display: 'flex',
                   justifyContent: 'center',
               }}
               />
        </Container>
    </ThemeProvider>
  )
}

export default CoinsTable