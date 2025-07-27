import { useState, useEffect, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_ROUTE_SLUGS } from '../../../../../../app/constants';

import ChildQuestionsList from './childQuestionsList';

function ChildQuestions(props) {
    const { state: { parentQuestion } } = useLocation();
    const { id: parentQuestionId } = useParams();
    const { loader } = useSelector(state => state.auth);

    return <>
        <div className="row">
            <div className="col-md-12">
                <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                    <span className="h5 mb-0">Avatar family child questions</span>
                </div>
                <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                    {!loader &&
                        <Link to={ADMIN_ROUTE_SLUGS.ADD_IDENTITY_QUESTION} className="btn primary-btn btn-xs">
                            <FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back
                        </Link>
                    }

                    {!loader &&
                        <Link to={ADMIN_ROUTE_SLUGS.ADD_IDENTITY_QUESTION} state={{ questionType: 'child', parentQuestionId: parentQuestionId }} className="btn primary-btn btn-xs">
                            <FontAwesomeIcon icon={faPlus} />&nbsp;Add more questions
                        </Link>
                    }
                </div>
                <ChildQuestionsList parentQuestionId={parentQuestionId} parentQuestion={parentQuestion} />
            </div>
        </div>
    </>
}
export default ChildQuestions;