import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Papa from 'papaparse';

import AvatarMenu from "../../avtars/AvatarMenu";
import { faArrowLeft, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTE_SLUGS, RESPONSE_CODE } from "../../../../app/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { AVTAR } from "../../../../app/config/endpoints";
import { postRequest } from "../../../../app/httpClient/axiosClient";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validationSchema = yup.object().shape({
    email: yup.string()
        .required("This Email field is required.")
        .email("Please enter a valid email address")
});

function AddNewEmployee(props) {
    const { guestMode = false, groupId = 0 } = props;
    const [isLoading, setLoading] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "submit",
        resolver: yupResolver(validationSchema),
    });

    const removeEmailFromList = (index) => {
        if (index >= 0 && index < emailList.length) {
            const updatedList = [...emailList];
            updatedList.splice(index, 1);
            setEmailList(updatedList);
        }
    }

    const onSubmit = (data, e) => {
        if (!emailList.includes(data.email)) {
            setEmailList([...emailList, data.email]);
        }
        reset();
        return false;
    }

    const InviteEmployees = async () => {
        try {
            setLoading(true);
            const payload = { emails: emailList }
            if (guestMode) {
                payload['groupId'] = groupId
            }
            const ENDPONT_URL = guestMode ? AVTAR.INVITE_GUEST : AVTAR.INVITE_EMPLOYEES;
            const response = await postRequest(ENDPONT_URL, payload);

            const { status, data: { data: { total, invitations }, httpStatusCode } } = response;
            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                setEmailList([])
                toast.success(`${guestMode ? 'Guest Invited successfully!' : 'Employee addedd successfully!'}`);
                setLoading(false);
                navigate(guestMode ? `${AUTH_ROUTE_SLUGS.MANAGE_GUEST_GROUP}/${groupId}` : AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE);
            }

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage)
            setLoading(false);
        }
    }

    // Function to handle file selection
    const handleFileChange = (event) => {
        try {
            const file = event.target.files[0];
            if (file && file.type !== "text/csv") {
                alert('Please upload a valid CSV file.');
                return;
                console.log('CSV file selected:', file);
                // You can process the file here or send it to the server
            }
            console.log("good to go!");
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvText = e.target.result;

                // Parse CSV text
                Papa.parse(csvText, {
                    header: false, // No headers in the file
                    skipEmptyLines: true, // Skip empty lines
                    complete: function (results) {
                        const data = results.data;
                        if (data.length > 0 && data[0].length !== 1) {
                            alert('The CSV file must have only one column.');
                            return;
                        }

                        const selectedEmailList = data.map(row => row[0]);
                        const validEmails = selectedEmailList.filter(email => isValidEmail(email));
                        console.log('Email List:', selectedEmailList);
                        console.log('Valid Email List:', validEmails);
                        setEmailList([...emailList, ...validEmails]);
                    },
                });
            };
            reader.readAsText(file);
            reset();
        } catch (error) {
            toast.error('we are facing some difficultiies while reading CSV files.')
        }

    };

    // Function to open the file dialog
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const isValidEmail = (email) => {
        return emailRegex.test(email);
    };
    return (<>
        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row position-relative">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">
                            Manage {guestMode ? 'Guest' : 'Employee'}
                        </h1>
                    </div>
                    <AvatarMenu />
                </div>
            </div>
        </section>
        <section className="spacer-md avator py-5">
            <div className="container">
                <div className="row ">
                    <svg
                        width="100%"
                        height="1050"
                        viewBox="0 0 1500 1500"
                        className="filter-svg"
                    >
                        <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
                    </svg>
                    <div className="col-md-12 mt-5 mx-auto">
                        <div className="box-wrap">
                            <div className="box-header profile-option-title flex-column">
                                <Link to={AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE}>
                                    <span role="button">
                                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                                    </span>
                                </Link>
                                <h2 className="h3 mb-0 mt-2">{guestMode ? 'Invite New Guest' : 'Add new Employee'}</h2>
                            </div>
                            <div className="box-body col-md-8">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="d-flex justify-content-between">
                                        <div className="flex-fill">
                                            <input
                                                {...register("email")}
                                                className="form-control chatbot_input"
                                                type="text"
                                                placeholder="Enter email"
                                                autoComplete="off"
                                                readOnly={isLoading}
                                            />
                                            {errors.email && (
                                                <p className="text-error">{errors.email.message}</p>
                                            )}
                                        </div>
                                        <div className="ms-4 flex-fill">
                                            <button disabled={isLoading} className="btn btn-xs btn-primary" type="submit" name="add">
                                                Add to List
                                            </button>
                                            <button
                                                disabled={isLoading}
                                                className="btn btn-xs btn-primary ms-2"
                                                onClick={handleUploadClick}
                                            >
                                                <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                                                Upload CSV
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        <div className="wrapper">
                                            <div className="chips_input" data-limit="15">
                                                <div className="inner">
                                                    {emailList.map((email, index) => {
                                                        return <div className="chip mb-2" key={`key-for-email-${index}`}>
                                                            {email}
                                                            {!isLoading &&
                                                                <span aria-label="remove this chip m-2" onClick={() => removeEmailFromList(index)}>
                                                                    <i className="ri-close-line" />
                                                                </span>
                                                            }
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <button disabled={isLoading || emailList.length === 0} className="btn btn-xs btn-primary" onClick={InviteEmployees}>
                                    {guestMode ? "Invite Guests" : "Add Employees"} {isLoading && <span className="spinner-border spinner-border-sm mx-2" role="status" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);
}

export default AddNewEmployee;