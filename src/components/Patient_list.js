import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Moment from 'react-moment'
import Modal from '@material-ui/core/Modal';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

const baseurl = 'http://49.50.167.136:9871/'

const theme = unstable_createMuiStrictModeTheme();

const columns = [
    {id: 'personID', label: '환자 ID', order:'person_id', align: 'center'},
    {id: 'gender', label: '성별', order:'gender', align: 'center'},
    {id: 'birthDatetime', label: '생년월일', order:'birth', align: 'center'},
    {id: 'age', label: '나이', align: 'center'},
    {id: 'race', label: '인종', order:'race', align: 'center'},
    {id: 'ethnicity', label: '민족', order:'ethnicity', align: 'center'},
    {id: 'isDeath', label: '사망여부', order:'death', align: 'center'}
]

const useStyles = makeStyles((theme) =>({
    title:{
        textAlign: 'center',
        fontSize: '3rem',
        fontWeight: 'bold',
        marginTop: '20px'
    },
    table:{
        width: '80%',
        margin:'20px auto'
    },
    filter:{
        fontSize: '1rem'
    },
    chartcontainer:{
        width:'80%',
        margin:'50px auto',
    },
    chart:{
        width: '80%',
    },
    modal:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
    modal_in:{
        minWidth: '400px',
        minHeight: '250px',
        backgroundColor: 'white',
        padding: '10px'
    },
    modal_title:{
        textAlign:'center',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    root: {
        position: 'relative',
        marginBottom: '10px',
      },
    dropdown: {
        position: 'absolute',
        top: 45,
        right: 0,
        left: 0,
        zIndex: 5,
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
      },
}));


const Patient_list = () =>{
    const classes = useStyles();
    const [plist,setPlist] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order_column, setOrder_column] = useState('death');
    const [order_desc, setOrder_desc] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [vcount, setVcount] = useState();
    const [clists, setClists] = useState([]);
    const [serise, setSerise] = useState([]);
    const [chart_gender, setChart_gender] = useState([]);
    const [chart_ethnicity, setChart_ethnicity] = useState([]);
    const [chart_race, setChart_race] = useState([]);
    const [open, setOpen] = useState(false);
    const [checkedg, setCheckedg] = useState([]);
    const [checkedr, setCheckedr] = useState([]);
    const [checkede, setCheckede] = useState([]);
    const [checkedd, setCheckedd] = useState([]);
    const [filter_gender, setFilter_gender] = useState([]);
    const [filter_race, setFilter_race] = useState([]);
    const [filter_ethnicity, setFilter_ethnicity] = useState([]);
    const filter_IsDeath = [true,false]
    const [minage, setMinage] = useState('');
    const [maxage, setMaxage] = useState('');

    const handleTogglegender = (value) => () => {
        const currentIndex = checkedg.indexOf(value);
        const newCheckedg = [...checkedg];

        if (currentIndex === -1) {
            for(var i=0; i< filter_gender.length;i++){
                if (checkedg.includes(filter_gender[i])){
                    newCheckedg.splice(currentIndex, 1);
                }
            }
            newCheckedg.push(value);
        } else {
            newCheckedg.splice(currentIndex, 1);
    }

    setCheckedg(newCheckedg);
    };
    const handleTogglerace = (value) => () => {
        const currentIndex = checkedr.indexOf(value);
        const newCheckedr = [...checkedr];

        if (currentIndex === -1) {
            for(var i=0; i< filter_race.length;i++){
                if (checkedr.includes(filter_race[i])){
                    newCheckedr.splice(currentIndex, 1);
                }
            }
            newCheckedr.push(value);
        } else {
            newCheckedr.splice(currentIndex, 1);
    }

    setCheckedr(newCheckedr);
    };
    const handleToggleethnicity = (value) => () => {
        const currentIndex = checkede.indexOf(value);
        const newCheckede = [...checkede];

        if (currentIndex === -1) {
            for(var i=0; i< filter_ethnicity.length;i++){
                if (checkede.includes(filter_ethnicity[i])){
                    newCheckede.splice(currentIndex, 1);
                }
            }
            newCheckede.push(value);
        } else {
            newCheckede.splice(currentIndex, 1);
    }

    setCheckede(newCheckede);
    };
    const handleToggleisdeath = (value) => () => {
        const currentIndex = checkedd.indexOf(value);
        const newCheckedd = [...checkedd];

        if (currentIndex === -1) {
            for(var i=0; i< filter_IsDeath.length;i++){
                if (checkedd.includes(filter_IsDeath[i])){
                    newCheckedd.splice(currentIndex, 1);
                }
            }
            newCheckedd.push(value);
        } else {
            newCheckedd.splice(currentIndex, 1);
    }

    setCheckedd(newCheckedd);
    };

    const handleSearch = (()=>{
        var url = baseurl+`api/patient/list?page=${page}&order_column=${order_column}&order_desc=${order_desc}`
        if (checkedg.length === 1){
            url += `&gender=${checkedg}`
        }
        if (checkedr.length === 1){
            url += `&race=${checkedr}`
        }
        if (checkede.length === 1){
            url += `&ethnicity=${checkede}`
        }
        if (checkedd.length === 1){
            url += `&death=${checkedd}`
        }
        if (minage){
            url += `&age_min=${minage}`
        }
        if (maxage){
            url += `&age_max=${maxage}`
        }
        axios.get(url)
        .then((res)=>{
            // console.log(res.data.patient.list)
            setPlist(res.data.patient.list)
        }).catch((err)=>{
            console.log(err)
        })

        setOpen(false)
    })
  

    const options1 = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '성별 환자 수'
        },
        series: [
          {
            name: '성별 환자 수',
            data: [
                ['Female',chart_gender[0]],
                ['Male', chart_gender[1]]
            ]
          }
        ],
      };

    const options2 = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '인종별 환자 수'
        },
        series: [
          {
            name: '인종별 환자 수',
            data: [
                ['hispanic',chart_ethnicity[0]],
                ['nonhispanic', chart_ethnicity[1]]
            ]
          }
        ]
      };

    const options3 = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '민족별 환자 수'
        },
        series: [
          {
            name: '민족별 환자 수',
            data: [
                ['native',chart_race[0]],
                ['asian', chart_race[1]],
                ['white', chart_race[2]],
                ['black', chart_race[3]],
                ['other', chart_race[4]]
            ]
          }
        ]
      };
    const options4 = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '(성별+인종)별 환자 수'
        },
        series: [
          {
            name: '(성병+인종)별 환자 수',
            data: [
                ['Female+hispanic',chart_gender[0]+chart_ethnicity[0]],
                ['Female+nonhispanic',chart_gender[0]+chart_ethnicity[1]],
                ['Male+hispanic', chart_gender[1]+chart_ethnicity[0]],
                ['Male+nonhispanic', chart_gender[1]+chart_ethnicity[1]]
            ]
          }
        ]
      };
    const options5 = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '(성별+민족)별 환자 수'
        },
        series: [
          {
            name: '(성병+민족)별 환자 수',
            data: [
                ['Female+native',chart_gender[0]+chart_race[0]],
                ['Female+asian',chart_gender[0]+chart_race[1]],
                ['Female+white',chart_gender[0]+chart_race[2]],
                ['Female+black',chart_gender[0]+chart_race[3]],
                ['Male+native', chart_gender[1]+chart_race[0]],
                ['Male+asian', chart_gender[1]+chart_race[1]],
                ['Male+white', chart_gender[1]+chart_race[2]],
                ['Male+black', chart_gender[1]+chart_race[3]],
            ]
          }
        ]
      };

    const changeMinage = ((e)=>{
        setMinage(e.target.value)
    })

    const changeMaxage = ((e)=>{
        setMaxage(e.target.value)
    })

    const handleClick = () => {
        setOpen((prev) => !prev);

        axios.get(baseurl+'api/gender/list')
        .then((res)=>{
            // console.log(res.data.genderList)
            setFilter_gender(res.data.genderList)
        }).catch((err)=>{
            console.log(err)
        })
        axios.get(baseurl+'api/race/list')
        .then((res)=>{
            // console.log(res.data.raceList)
            setFilter_race(res.data.raceList)
        }).catch((err)=>{
            console.log(err)
        })

        axios.get(baseurl+'api/ethnicity/list')
        .then((res)=>{
            // console.log(res.data.ethnicityList)
            setFilter_ethnicity(res.data.ethnicityList)
        }).catch((err)=>{
            console.log(err)
        })        
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    const arrowHandler = ((e)=>{
        setOrder_desc(!order_desc)
        if (order_column !== e) {
            setOrder_column(e)
        } 
    })

    const openModal = ((id)=>{
        setShowModal(true)
        axios.get(baseurl+`api/patient/brief/${id}`)
            .then((res)=>{
                setVcount(res.data.visitCount)
                setClists(res.data.conditionList)
            }).catch((err)=>{
                console.log(err)
            })
      })
  
      const setCloseModal =(()=>{
        setShowModal(false)
      })

    const conditionlist = clists.map((clist, index)=>
      <p className='mb-1' key={index}>
          {clist}
      </p>
    )

    useEffect(()=>{
        var gender = [0,0]
        var ethnicity = [0,0]
        var race = [0,0,0,0,0]
        var i = 0
        for(i;i<serise.length;i++){
            if (serise[i].gender==='F' && (checkedg.length === 0 || checkedg.includes('F'))){
                gender[0]++
            }else if (serise[i].gender==='M' && (checkedg.length === 0 || checkedg.includes('M'))){
                gender[1]++
            }
            if (serise[i].ethnicity === 'hispanic' && (checkede.length === 0 || checkede.includes('hispanic'))){
                ethnicity[0] ++
            }else if (serise[i].ethnicity === 'nonhispanic' && (checkede.length === 0 || checkede.includes('nonhispanic'))){
                ethnicity[1] ++
            }
            if (serise[i].race === 'native' && (checkedr.length === 0 || checkede.includes('native'))){
                race[0]++
            }else if (serise[i].race === 'asian' && (checkedr.length === 0 || checkede.includes('asian'))){
                race[1]++
            }else if (serise[i].race === 'white' && (checkedr.length === 0 || checkede.includes('white'))){
                race[2]++
            }else if (serise[i].race === 'black' && (checkedr.length === 0 || checkede.includes('black'))){
                race[3]++
            }else if (serise[i].race === 'other' && (checkedr.length === 0 || checkede.includes('other'))){
                race[4]++
            }
        }
        setChart_gender(gender)
        setChart_ethnicity(ethnicity)
        setChart_race(race)
    },[serise,plist,checkedg,checkede,checkedr])



    useEffect(()=>{
        axios.get(baseurl+`api/patient/list?page=${page}&order_column=${order_column}&order_desc=${order_desc}`)
        .then((res)=>{
            // console.log(res.data.patient.list)
            setPlist(res.data.patient.list)
        }).catch((err)=>{
            console.log(err)
        })

        axios.get(baseurl+'api/patient/stats')
        .then((res)=>{
            setSerise(res.data.stats)
        }).catch((err)=>{
            console.log(err)
        })
    },[page,order_column,order_desc])
    // console.log(plist)


    return(
        <div>
            <p className={classes.title}>Patient_list</p>
            <TableContainer className={classes.table}>
            <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClickAway}
                >
                <div className={classes.root}>
                    <div className="d-flex justify-content-end">
                        <IconButton aria-label="filter list" onClick={handleClick}>
                            <small className={classes.filter}>FILTER</small>
                                <FilterListIcon  />
                        </IconButton>
                    </div>
                    {open ? (
                    <div className={classes.dropdown}>
                        <List className="d-flex justify-content-between">
                            <div className='text-center'>
                                <strong>Gender</strong>
                                {filter_gender.map((value) => {
                                    const labelId = `checkbox-list-label-${value}`;

                                    return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleTogglegender(value)}>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            name="Fgender"
                                            checked={checkedg.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value} />
                                    </ListItem>
                                    );
                                })}
                            </div>
                            <div className='text-center'>
                                <strong>Race</strong>
                                {filter_race.map((value) => {
                                    const labelId = `checkbox-list-label-${value}`;

                                    return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleTogglerace(value)}>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkedr.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value} />
                                    </ListItem>
                                    );
                                })}
                            </div>
                            <div className='text-center'> 
                                <strong>Ethnicity</strong>
                                {filter_ethnicity.map((value) => {
                                    const labelId = `checkbox-list-label-${value}`;

                                    return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleToggleethnicity(value)}>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkede.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value} />
                                    </ListItem>
                                    );
                                })}
                            </div>
                            <div className='text-center'>
                                <strong>IsDeath</strong>
                                {filter_IsDeath.map((value) => {
                                    const labelId = `checkbox-list-label-${value}`;

                                    return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleToggleisdeath(value)}>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkedd.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                        </ListItemIcon>
                                        {value === true ? 
                                        <ListItemText id={labelId} primary='T' /> : <ListItemText id={labelId} primary='F' />}
                                    </ListItem>
                                    );
                                })}
                            </div>
                            <div className='text-center'>
                                <strong>Age</strong>
                                <ListItem role={undefined} dense button>
                                    <TextField label="Min-age" value={minage} onChange={changeMinage} />
                                </ListItem>
                                <ListItem role={undefined} dense button>
                                    <TextField label="Max-age" value={maxage} onChange={changeMaxage} />
                                </ListItem>
                            </div>
                        </List>
                        <div className="d-flex justify-content-end">
                            <Button variant="outlined" onClick={handleSearch}>SEARCH</Button>
                        </div>
                    </div>
                    ) : null}
                </div>
            </ClickAwayListener>
                <Table stickyHeader aria-label="sticky table"> 
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            >
                            {column.label}
                            
                            {column.id !== 'age' ?
                            <span>{(order_column === column.order && order_desc === true) ?  <ArrowDropDownIcon onClick={()=>arrowHandler(column.order)}/> :<ArrowDropUpIcon onClick={()=>arrowHandler(column.order)}/>}</span> :
                            <span></span>}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient, index) => {
                            
                        return (
                            <TableRow hover tabIndex={-1} key={index}>
                            {columns.map((column) => {
                                const value = patient[column.id];
                                // console.log(patient)
                                return (
                                  
                                <TableCell key={column.id} align={column.align} onClick={()=>openModal(patient.personID)}>

                                  {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                                    {column.id !== "birthDatetime" && column.id !== "isDeath" && value}
                                    {column.id === "birthDatetime" && <Moment format="YYYY-MM-DD HH:mm">{value}</Moment>}
                                    {column.id === "isDeath" && value === false && <span>N</span>}
                                    {column.id === "isDeath" && value === true && <span>Y</span>}
                                </TableCell>  
                                );
                            })}
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>
                    <ThemeProvider theme = {theme}>
                <TablePagination
                    className="mr-4"
                    rowsPerPageOptions={[10, 50, 100]}
                    component="div"
                    count={plist.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </ThemeProvider>
                </TableContainer>
                <Modal
                  className={classes.modal} variant="outlined"
                  open={showModal}
                  onClose={setCloseModal}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div className={classes.modal_in}>
                      <div className='d-flex justify-content-end'>
                        <small>Visit_Count : {vcount}</small>  
                      </div>
                      <p className={classes.modal_title}>Condition_List</p>
                    {conditionlist}
                  </div>
                </Modal>
                <div className={classes.chartcontainer}>
                    <div className="d-flex justify-content-between">
                        <div className={classes.chart}>
                            <HighchartsReact  highcharts={Highcharts} options={options1} />    
                        </div>
                        <div className={classes.chart}>
                            <HighchartsReact highcharts={Highcharts} options={options2} />    
                        </div>
                        <div className={classes.chart}>
                            <HighchartsReact highcharts={Highcharts} options={options3} />    
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className={classes.chart}>
                            <HighchartsReact highcharts={Highcharts} options={options4} />    
                        </div>
                        <div className={classes.chart}>
                            <HighchartsReact highcharts={Highcharts} options={options5} />    
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Patient_list