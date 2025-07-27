import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { postRequest } from '../../../../../app/httpClient/axiosClient';
import actions, { ACTION_SERVICES } from '../../../../../redux/authenticate/actions';
import { RESPONSE_CODE, ADMIN_ROUTE_SLUGS, DEFAULT_VALUE } from '../../../../../app/constants';
import { ADMIN } from '../../../../../app/config/endpoints'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { getErrorMessage } from '../../../../../utils/helpers/apiErrorResponse';
import { RESPONSE_MESSAGES } from '../../../../../app/constants/localizedStrings';
import ReactPaginate from 'react-paginate';
import QuestionItem from './qustionItem';
import Toaster from '../../../../../components/UI/Toast';

function QuestionsList() {
    const LOCALE = DEFAULT_VALUE.LOCALE

    const dispatch = useDispatch();
    const { loader, errorMessage, toast } = useSelector(state => state.auth);
    const [familyQustions, setFamilyQustions] = useState([]);

    const [pageNo, setPageNo] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(DEFAULT_VALUE.QUESTIOS.RECORDS_PER_PAGE);

    const [isQuestionUpdate, setQuestionUpdate] = useState(false);

    async function getFamilyQuestions() {
        dispatch(ACTION_SERVICES(actions.API_PROCESS));
        let payloadData = JSON.stringify({
            skip: pageNo * recordsPerPage,
            take: recordsPerPage,
            ignoreTakeSkip: false,
        });

        try {
            const { status, data: { httpStatusCode, data: { questions, count } } } = await postRequest(ADMIN.INTERCEPT_QUESTION.LIST, payloadData);

            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setFamilyQustions(questions);
                setTotalRecordsCount(count);
                setPageCount(Math.ceil(count / recordsPerPage));
                dispatch(ACTION_SERVICES(actions.PROCESS_INIT));
            } else {
                dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].FETCHING_QUESTIONS));
            }
        } catch (error) {
            dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].FETCHING_QUESTIONS));
        }
    }

    const handlePageChange = (event) => {
        setPageNo(event.selected);
    }

    useEffect(() => {
        setPageCount(Math.ceil(totalRecordsCount / recordsPerPage));
        getFamilyQuestions();
        window.scrollTo(0, 0);
    }, [pageNo, recordsPerPage]);

    if (loader) {
        return <>
            <div className='loading1 mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                <p className="fs-1">Please wait...</p>
            </div>
        </>
    }

    if (errorMessage) {
        return <>
            <table className="table">
                <thead>
                    <tr><th className='text-error text-center fs-1'>{errorMessage}</th></tr>
                </thead>
            </table>
        </>
    }

    return <>
        <QuestionItem loader={loader} questionList={familyQustions} getFamilyQuestions={getFamilyQuestions} />

        <div className='grid1'>


            {!loader &&
                <>
                    <select value={recordsPerPage} onChange={(event) => setRecordsPerPage(event.target.value)} className="form-control max-w-100">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>

                    <ReactPaginate
                        nextLabel="Next >"
                        previousLabel="< Previous"
                        pageRangeDisplayed={4}
                        marginPagesDisplayed={4}
                        breakLabel="..."
                        pageclassName="page-item"
                        pageLinkclassName="page-link"
                        previousclassName="page-item"
                        previousLinkclassName="page-link"
                        nextclassName="page-item"
                        nextLinkclassName="page-link"
                        breakclassName="page-item"
                        breakLinkclassName="page-link"
                        containerclassName="pagination"
                        activeclassName="active"
                        renderOnZeroPageCount={null}
                        initialPage={pageNo}
                        onPageChange={handlePageChange}
                        pageCount={pageCount}
                    />
                    <Link to={ADMIN_ROUTE_SLUGS.ADD_INTERCEPT_QUESTION} state={{ questionType: 'parent', parentQuestionId: 0 }} className="btn primary-btn btn-xs">
                        <FontAwesomeIcon icon={faPlus} />&nbsp;Add more questions
                    </Link>
                </>
            }
        </div>

        {toast?.type &&
            <Toaster
                status={toast.status}
                type={toast.type}
                message={toast.message}
            />

        }
    </>
}

export default QuestionsList;