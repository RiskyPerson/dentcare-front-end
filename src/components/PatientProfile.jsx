import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import TreatmentPlanList from './TreatmentPlanList';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Allergy from './Allergy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {tableCellClasses ,styled, Paper, Stepper, StepLabel, Step, TextField, Button, InputLabel, Select, MenuItem, FormControl, Card, CardHeader, CardContent, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, FormControlLabel } from '@mui/material';

function PatientDetails({ role }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [dataTreatmentPlan, setDataTreatmentPlan] = useState({});
    const [finalData, setFinalData] = useState([]);
    const location = useLocation();
    const auth = useAuth();
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [precriptions, setPrescriptions] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [dentists, setDentists] = useState([]);
    const [treatmentCodes, setTreatmentCodes] = useState([]);
    const [teeth, setTeeth] = useState([]);
    const [surfaces, setSurfaces] = useState([]);
    const [treatmentCategories, setTreatmentCategories] = useState([])
    const [patient, setPatient] = useState(location.state.patient);

    const [startDate, setStartDate] = useState(new Date());
    const [selectedToTreat, setSelectedToTreat] = useState([]);
    const [selectedDentistId, setSelectedDentistId] = useState(null)
    const [selectedTreamentCodeIds, setSelectedTreatmentCodeIds] = useState([]);
    const [selectedSurfaceIds, setSelectedSurfaceIds] = useState([]);

    const [selectedTreatmentCategoryId, setSelectedTreatmentCategoryId] = useState(-1)
    const [selectedTeeth, setSelectedTeeth] = useState([]);
    const apiUrl = `http://localhost:8080`
    
    const [allergies, setAllergies] = useState([])
    const getTreatmentsPlans = async () => {
        const res = await axios.get(`http://localhost:8080/treatment-plans/${patient.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            params: {
                patient: patient.id
            }
        })
        console.log("Treatment plan", res.data);
        setTreatmentPlans(res.data)
    }
    const fetchTreatmentCategories = async () => {
        const res = await axios.get(`${apiUrl}/treatment-categories`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        console.log("Treatment categories", res.data);
        setTreatmentCategories(res.data);
    };
    const fetchTreatmentCodes = async () => {
        const res = await axios.get(`${apiUrl}/treatment-codes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
            params: {
                treatmentCategory: selectedTreatmentCategoryId
            }
          });
          console.log("Treatment codes", res.data);
          setTreatmentCodes(res.data)
    }
    
    
    

    // const getMedicines = async () => {
    //     const res = await axios.get(`http://localhost:8080/medications`, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${auth.accessToken}`
    //         },
    //         // params: {
    //         //     patient: patient.id
    //         // }
            
    //     })
    //     setMedicines(res.data)
    // }
    const fetchTeeth = async () => {
        const res = await axios.get(`${apiUrl}/teeth`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        })
        console.log("Teeth", res.data);
        setTeeth(res.data)
    }
    const fetchSurfaces = async () => {
        const res = await axios.get(`${apiUrl}/surfaces`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        })
        console.log("Surfaces", res.data);
        setSurfaces(res.data)
    }
    const fetchDentists = async () => {
        const res = await axios.get(`${apiUrl}/users/all`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          },
          params: {
            role: 'ROLE_DENTIST'
          }
        });
        setDentists(res.data);
    }
    const getPrescriptions = async () => {
        const res = await axios.get(`http://localhost:8080/prescriptions`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            params: {
                patient: patient.id
            }
        })
        setPrescriptions(res.data)
    }
    const fetchAllergies = async () => {
        const res = await axios.get(`http://localhost:8080/patients/allergic/${patient.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        })
        setAllergies(res.data);
    }
    const addPrescriptions = async () => {
        const res = await axios.post(`http://localhost:8080/prescriptions`, {
            patientId: patient.id,
        })
    }

    const handleAddAllergy = async (medId) => {
        const res = await axios.post(`http://localhost:8080/patients/allergic/${patient.id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            params: {
                medicine: medId
            }
        })
        setAllergies([...allergies, res.data])
    }


    useEffect(() => {
        // getMedicines();
        fetchDentists();
        fetchTreatmentCategories();
        getTreatmentsPlans();
        getPrescriptions();
        fetchAllergies();
    }, []);
    useEffect(() => {
        fetchTreatmentCodes();
        fetchTeeth();
        fetchSurfaces();
        
    }, [selectedTreatmentCategoryId])
    console.log("Patient", patient);
    const getAge = (dob) => {
        const birthDay = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDay.getFullYear();

        let m = today.getMonth() - birthDay.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDay.getDate())) {
            age--;
        }
        return age;
    }
    

    const handleUpdateOralHealth = async () => {
        console.log(patient.oralHealth);
        const res = await axios.put(`http://localhost:8080/patients/oral-health/${patient.id}`, { oralHealth: patient.oralHealth }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
    }

    const handleShowStep = (step) => {
        switch (step) {
            case 1:
                return <div>
                    <FormControl className='w-25 mt-3'>
                        <TextField margin="normal" variant="outlined" type='date' color="secondary" value={dataTreatmentPlan['date']}                               
                                onChange={(e) => setStartDate(e.target.value)} />
                    </FormControl>

                    <div className="mt-3">

                        <FormControl className='w-25'>

                            <InputLabel id="demo-simple-select-label">Dentist</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                // value={dataTreatmentPlan['dentistId']}
                                // Save selected dentist to dataTreatmentPlan for reusing and for back to previous step
                                onChange={(e) => setSelectedDentistId(e.target.value)}
                                id="demo-simple-select"
                                label="Dentist"
                                className='w-100'
                            >
                                {dentists.map((dentist) => (
                                    <MenuItem value={dentist.id} key={dentist.id}>{dentist.name}</MenuItem>
                                ))}
                                
                            </Select>
                        </FormControl>
                    </div>
                    <div className="mt-2">
                        <FormControl className='w-25 mt-3'>
                            <InputLabel id="treatment-simple-select-label">Treatment category</InputLabel>
                            <Select
                                labelId="treatment-simple-select-label"
                                // value={dataTreatmentPlan['treatment']}
                                // Save selected treatment item to dataTreatmentPlan for reusing and for back to previous step
                                // onChange={(e) => { setDataTreatmentPlan({ ...dataTreatmentPlan, 'treatment': e.target.value }) }}
                                onChange={(e) => setSelectedTreatmentCategoryId(e.target.value)}
                                id="treatment-simple-select"
                                label="Treatment category"
                                className='w-100'
                            >
                                {treatmentCategories.map((category) => (
                                    <MenuItem value={category.id} key={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                                
                            </Select>
                        </FormControl>
                    </div>
                    <div className="mt-3">
                        <p>Treatment Code</p>
                        <FormControl className='w-25'>

                            <div className='d-flex flex-row justify-content-center gap-4'>
                                {treatmentCodes.map((code) => (
                                <FormControlLabel control={<Checkbox value={code.id} />} label={code.description} onChange={(e) => {
                                    const newSelectedTreatmentCode = e.target.checked ? [...selectedTreamentCodeIds, code.id] : selectedTreamentCodeIds.filter(selected => selected !== code.id);
                                    console.log("New selected treatment code", newSelectedTreatmentCode);
                                    setSelectedTreatmentCodeIds(newSelectedTreatmentCode);
                                }}/>   
                                ))}
                            </div>
    
                        </FormControl>
                    </div>



                    <div className="mt-3">
                        <Button variant="contained" color="primary" onClick={() => setCurrentStep(2)}>Next</Button>
                    </div>
                </div>
            case 2:
                return <>
                    <FormControl className='w-100 mt-3'>
                        <div className='fs-5 fw-bold'>Select teeth</div>
                        <div className='row justify-content-center'>
                            {teeth.map((tooth => (
                            <FormControlLabel className='col-3' control={<Checkbox value={tooth.id} />} label={tooth.toothName} key={tooth.id} onChange ={(e) => {
                                const newSelectedTeeth = e.target.checked ? [...selectedTeeth, tooth.id] : selectedTeeth.filter((id) => id !== tooth.id);
                                console.log("Selected teeth", newSelectedTeeth);
                                setSelectedTeeth(newSelectedTeeth)
                                
                            }}
                            />   
                            )))}
                        </div>
                    </FormControl>

                    <div className=" mt-5">
                        <FormControl className=' row justify-content-end'>
                                <div className='fs-5 fw-bold'>Select surface</div>
                                <div className='row justify-content-center'>
                                    {surfaces.map((surface => (
                                        <FormControlLabel className='col-4' control={<Checkbox value={surface.id} />} label={surface.name} key={surface.id} onChange={(e) => {
                                            const newSelectedSurface = e.target.checked ? [...selectedSurfaceIds, surface.id] : selectedSurfaceIds.filter(selected => selected !== surface.id);
                                            console.log("New selected surface", newSelectedSurface);
                                            setSelectedSurfaceIds(newSelectedSurface);
                                        }}/>   
                                    )))}
                                </div>
                        </FormControl>
                    </div>
                

                    <div className="mt-3 d-flex justify-content-center">
                        <Button variant="contained" color="secondary" className='mx-5' onClick={() => setCurrentStep(1)}>Back</Button>

                        <Button variant="contained" color="primary" onClick={() => setCurrentStep(3)}>Next</Button>
                    </div>
                </>
            case 3:
                return <>
                    <Card className='mt-3'>
                        <CardHeader>
                            <p>Review information</p>
                        </CardHeader>
                        <CardContent>

                            <div className="">
                                <p>Date: {startDate}</p>
                            </div>

                            <div className="">
                                <p>Dentist: {dentists.find(dentist => dentist.id === selectedDentistId).name}</p>
                            </div>

                            <div className="">
                                <p>Treatment: {treatmentCodes.filter(code => selectedTreamentCodeIds.includes(code.id)).map(code => code.description).join(', ')}</p>
                            </div>

                            <div className="">
                                <p>Tooth: {teeth.filter(tooth => selectedTeeth.includes(tooth.id)).map(tooth => tooth.toothName).join(', ')}</p>
                            </div>

                            <div className="">
                                <p>Surface: {surfaces.filter(surface => selectedSurfaceIds.includes(surface.id)).map(surface => surface.name).join(', ')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-3">
                        <Button variant="contained" className='me-3' color="secondary" onClick={() => setCurrentStep(2)}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleAddTreatmentPlan}>Submit</Button>
                    </div>


                </>
        }
    }

    const handleAddTreatmentPlan = async () => {
        const toothSelectionDto = []
        for(let toothId of selectedTeeth){
            toothSelectionDto.push({toothId, surfacesId: selectedSurfaceIds})
        }
        console.log("Tooth selection dto", toothSelectionDto);
        const treatmentPlanToAdd = {
            patientId: patient.id,
            treatmentCodeId: selectedTreamentCodeIds,
            dentistId: selectedDentistId,
            assitantId: null,
            note: null,
            startingDate: startDate,
            status: 'Planned',
            toothSelectionDtoList: toothSelectionDto
        }
        console.log("Request", treatmentPlanToAdd);
        const res = await axios.post(`${apiUrl}/treatment-plans`, treatmentPlanToAdd, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        })
        console.log("New treatment plan", res.data)
        setTreatmentPlans([...treatmentPlans, res.data]);
        setCurrentStep(1);
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 15,
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



    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="w-100 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad" >


                        <div className="panel panel-info">
                            <div className="panel-heading text-center mb-4">
                                <h3 className="panel-title">Patient Profile</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row justify-content-center">



                                    <div className=" col-md-9 col-lg-9 ">
                                        <table className="table table-user-information">
                                            <tbody>
                                                <tr>
                                                    <td> <b>Personal Information: </b></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>ID:</td>
                                                    <td> {patient.id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Patient name:</td>
                                                    <td> {patient.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Gender:</td>
                                                    <td>{patient.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td>Age:</td>
                                                    <td>{getAge(patient.dob)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Oral health:</td>
                                                    <td>{patient.oralHealth}
                                                        <a href="">Update</a>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>Phone:</td>
                                                    <td>{patient.phoneNumber}</td>
                                                </tr>

                                                <tr>
                                                    <td> <b > Medical Information:</b></td>
                                                    <td> </td>

                                                </tr>

                                            </tbody>
                                        </table>

                                        <div className="panel-heading text-center mt-5">
                                            <h3 className="panel-title">Allergic medicines</h3>
                                        </div>
                                        <div className="board mt-4 d-flex justify-content-center">
                                            <table className="table table-striped">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Gender</th>
                                                        <th scope="col">Day of birth</th>
                                                        <th scope="col">Address</th>
                                                        <th scope="col">Phone Number</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allergies && allergies.map((medicine, idx) => (
                                                        <tr key={medicine.id}>
                                                            <th scope="row">{idx + 1}</th>
                                                            <td>{medicine.name}</td>
                                                            <td>{}</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td colSpan={1} className="d-flex gap-3 align-middle">
                                                                {/* <Link to={`/patients-profile`} state={{patientData: patient}}>
              <div className="px-3"><FontAwesomeIcon icon={faEye} style={{'color' : 'green'}}/></div>
            </Link> */}
                                                                <div data-bs-toggle="modal" data-bs-target="#editModal"><FontAwesomeIcon icon={faEdit} style={{ 'color': 'green' }} /></div>
                                                                <div className="modal fade" id="editModal" tabIndex={'-1'} aria-labelledby="editModalLabel" aria-hidden="true">
                                                                    <div className="modal-dialog">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header">
                                                                                <h1 className="modal-title fs-5 fw-bold" id="editModalLabel">Update Patient</h1>
                                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                            </div>
                                                                            <div className="modal-body">
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="nameToUpdate" className="form-label">Full name</label>
                                                                                    <input type="text" className="form-control" id="nameToUpdate" onChange={(e) => setName(e.target.value)} defaultValue={patient.name} required />
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="addressToUpdate" className="form-label">Address</label>
                                                                                    <input type="text" className="form-control" id="addressToUpdate" onChange={(e) => setAddress(e.target.value)} defaultValue={patient.address} required />
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="phoneNumberToUpdate" className="form-label">Phone number</label>
                                                                                    <input type="text" className="form-control" id="phoneNumberToUpdate" onChange={(e) => setPhoneNumber(e.target.value)} defaultValue={patient.phoneNumber} required />
                                                                                </div>

                                                                                <div className="mb-3">
                                                                                    <label htmlFor="addressToUpdate" className="form-label">Address</label>
                                                                                    <input type="text" className="form-control" id="addressToUpdate" onChange={(e) => setAddress(e.target.value)} defaultValue={patient.address} required />
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="dobToUpdate" className="form-label">Day of birth</label>
                                                                                    <input type="date" className="form-control" id="dobToUpdate" onChange={(e) => setDob(e.target.value)} value={patient.dob} required />
                                                                                </div>

                                                                            </div>
                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                <button type="button" className="btn btn-primary" onClick={() => handleUpdate(patient.id)}>Update</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <h3 className="text-center mt-5 mb-4">Treatment plan</h3>
                                        <Stepper style={{ width: '100%' }} activeStep={currentStep - 1} orientation='horizontal'>
                                            <Step>
                                                <StepLabel></StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel></StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel></StepLabel>
                                            </Step>
                                        </Stepper>
                                        <div className="text-center">
                                            {handleShowStep(currentStep)}
                                        </div>

                                        {/* <TableContainer component={Paper} className='mt-4'>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>Date</StyledTableCell>
                                                        <StyledTableCell align="right">Dentist</StyledTableCell>
                                                        <StyledTableCell align="right">Treatment</StyledTableCell>
                                                        <StyledTableCell align="right">Tooth</StyledTableCell>
                                                        <StyledTableCell align="right">Surface</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {finalData.map((data, index) => (
                                                        <StyledTableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <StyledTableCell component="th" scope="row">
                                                                {data.date}
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {data.dentistName}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="right">{data.treatment}</StyledTableCell>
                                                            <StyledTableCell align="right">{data.tooth}</StyledTableCell>
                                                            <StyledTableCell align="right">{data.surface}</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer> */}
                                        <TreatmentPlanList treatmentPlans={treatmentPlans}/>

                                        <div className="text-center mt-5">

                                            <a href="#" className="btn btn-primary edit-btn-profile me-3">Edit</a>

                                            <a href="#" className="btn btn-primary homepage-btn-profile"> Homepage</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PatientDetails
