import React, { useEffect, useState } from "react";
import { AVTAR } from "../../../../../../../app/config/endpoints";
import { DEFAULT_VALUE, MEDIA_CATEGORY, RESPONSE_CODE } from "../../../../../../../app/constants";
import { getErrorMessage } from "../../../../../../../utils/helpers/apiErrorResponse";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { postRequest } from "../../../../../../../app/httpClient/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { PHOTO_ALBUM_ACTIONS as ACTIONS } from "../../../../../../../redux/authenticate/actions";
import YearItem from "./YearItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import MonthItem from "./MonthItem";

function DateFilter(props) {
    const { avatorId, mediaCategory, TABS_LIST, photoAlbumfilterKey } = props
    const { dateFilter: { isLoading, message, messageType, selectedYear, selectedMonth } } = useSelector((state) => state.photo_album_reducer);
    const dispatch = useDispatch();

    const [yearFilter, setYearFilter] = useState([]);
    const [monthFilter, setMonthFilter] = useState([]);
    // const [selectedYear, setSelectedYear] = useState(reduxSelectedYear);

    async function getDateFilter(url) {
        dispatch({ type: ACTIONS.DATE_IS_LOADING })
        const LOCALE = DEFAULT_VALUE.LOCALE

        const filteData = {
            avatarId: avatorId,
            mediaCategory: mediaCategory,
        }

        if (selectedYear > 0) {
            filteData['year'] = selectedYear;
        }
        // return;
        const payloadData = JSON.stringify(filteData);
        console.log("payloadData ===> ", payloadData);
        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                console.log("MEDIA DATES ===> ", data);
                const { usedMonths, usedYears } = data;
                console.log({ usedMonths, usedYears })
                setYearFilter(usedYears.filter(year => year !== null));
                if (usedMonths !== null && usedMonths.length > 0) {
                    setMonthFilter(usedMonths.filter(month => month !== null));
                }
                dispatch({
                    type: ACTIONS.DATE_RESET_LOADING,
                });
                // setSubjectFilterList(data)
            } else {
                // dispatch({
                //     type: ACTIONS.SUBJECT_RESET_LOADING,
                // });
                console.log("get in else section");
            }
        } catch (error) {
            console.log(error)
            const errorMessage = getErrorMessage(error);
            console.error(errorMessage);
            // dispatch({
            //     type: ACTIONS.SUBJECT_PROCESS_FAILED,
            //     payload: { message: errorMessage },
            // });
        }
    }

    const handleYearChange = (year) => {
        const _selectedYear = selectedYear === year ? 0 : year
        dispatch({
            type: ACTIONS.HANDLE_DATE_YEAR,
            payload: { selectedYear: _selectedYear }
        })
        // setSelectedYear(_selectedYear);
    }
    const handleMonthChange = (month) => {
        const _selectedMonth = selectedMonth === month ? 0 : month
        dispatch({
            type: ACTIONS.HANDLE_MONTH_YEAR,
            payload: { selectedMonth: _selectedMonth }
        })
        // setSelectedYear(_selectedYear);
    }

    useEffect(() => {
        if (photoAlbumfilterKey === TABS_LIST.DATE.key) {
            getDateFilter(AVTAR.GET_AVATAR_DATE_FILTER);
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
            });
        }
    }, [photoAlbumfilterKey, selectedYear]);

    if (isLoading) {
        return <>
            <div className=''>
                <p className="placeholder-glow px-5">
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                </p>
            </div>
        </>
    }

    return (<>
        <div className="d-flex flex-column align-items-start">
            {yearFilter.length > 0
                ? <>
                    {selectedYear === 0 && yearFilter.map((year, index) => {
                        return <YearItem
                            key={`yaer-filter-key${index}`}
                            year={year}
                            selectedYear={selectedYear}
                            FnCallback={handleYearChange}
                        />
                    })}

                    {selectedYear > 0 && <div>
                        <span onClick={() => handleYearChange(selectedYear)} role="button">
                            <FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back
                        </span>
                        <p className="mt-2">Year: {selectedYear}</p>
                        {monthFilter.length > 0 &&
                            <div className="d-flex flex-column align-items-start">
                                {monthFilter.map((month, index) => {
                                    return <MonthItem
                                        key={`yaer-filter-key${index}`}
                                        month={month}
                                        selectedMonth={selectedMonth}
                                        FnCallback={handleMonthChange}
                                    />
                                })}

                            </div>
                        }
                    </div>}
                </>
                : <p>Years not found</p>
            }


        </div>
    </>)
}
export default DateFilter;