import { useState, useEffect, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_ROUTE_SLUGS } from '../../../../../app/constants';
import QuestionsList from './questionsList';

function AvatarStoryQuestion() {
    const { loader } = useSelector(state => state.auth);
    // console.log("hereeeee");
    return <>
        <div className="row">
            <div className="col-md-12">
                <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                    <span className="h5 mb-0">Avatar identity questions</span>
                    {!loader &&
                        <Link to={ADMIN_ROUTE_SLUGS.ADD_IDENTITY_QUESTION} state={{ questionType: 'parent', parentQuestionId: 0 }} className="btn primary-btn btn-xs">
                            <FontAwesomeIcon icon={faPlus} />&nbsp;Add more questions
                        </Link>
                    }
                </div>
                <QuestionsList />
            </div>
        </div>
    </>
}

export default AvatarStoryQuestion;
