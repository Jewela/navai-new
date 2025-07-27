import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import DatePicker from 'react-date-picker';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { RESPONSE_CODE } from '../../../../../app/constants';
import { getErrorMessage } from '../../../../../utils/helpers/apiErrorResponse';
import toast from 'react-hot-toast';
import { AVTAR } from '../../../../../app/config/endpoints';
import { postRequest, putRequest } from '../../../../../app/httpClient/axiosClient';
import { Spinner } from 'react-bootstrap';
import { getFormattedDate } from '../../../../../utils/helpers/function';

const subjectValidationSchema = yup.object().shape({
    subjectName: yup.string().required('Subject name is required.'),
});

const albumValidationSchema = yup.object().shape({
    id: yup.string().required('id is required.'),
    subject: yup.string().required('Subject is required.'),
    mediaDate: yup.string().required('Date is required.'),
    description: yup.string().required('Description is required.'),
});

function UpdatePhotoModal(props) {
    const { selectedAvatar: { status, avatarDetails }, FnCallback, avatarId, refreshAvatarMedia } = { ...defaultProps, ...props };
    const { imageBlobUrl: avatarImage, subject, subjectId, id: imageId, mediaDate, description, mediaCategory } = avatarDetails;

    const [mediaSubjects, setMediaSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState(false);
    const [fetchingSubjectStatus, setFetchingSubjectStatus] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [photoDetails, setPhotoDetails] = useState({
        mediaDate: mediaDate || null,
        subject: subject || null,
        description: description || null
    })

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        mode: 'all',
        resolver: yupResolver(albumValidationSchema),
        defaultValues: {
            description: description,
            mediaDate: mediaDate,
            id: imageId,
        }
    });

    const onDobChange = (_date) => {
        const inputDate = new Date(_date);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        setPhotoDetails({ ...photoDetails, mediaDate: formattedDate })
        setValue('mediaDate', formattedDate)
    }

    const handleSave = async (data) => {
        // return
        setLoading(true);
        try {
            let payloadData = {
                avatarId: avatarId,
                mediaCategory: mediaCategory,
                newAddedImages: [{
                    imageId: data.id,
                    mediaDate: data.mediaDate,
                    subjectId: data.subject,
                    description: data.description
                }]
            };

            // console.log("payloadData : ", payloadData);
            // setLoading(false);
            // return false;
            const response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);

            const { status, data: { result, httpStatusCode } } = response;
            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                // const successMessage = updateMode ? '' : 'Photo album created successfully.'
                toast.success('Photo album updated successfully.');
                refreshAvatarMedia();
                FnCallback();
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(`Photo album Couldn't be updated. Please try again.`)
            setLoading(false);
        }
    }

    const handleChangeSubject = (event) => {
        if (event.target.value === 'add_new') {
            console.log('hereer')
            setNewSubject(true);
        }
        return;
    }

    const getSubjects = async () => {
        setLoading(true);
        try {
            const payload = {
                mediaCategory: mediaCategory,
                avatarId: avatarId,
                filter: false
            }
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(AVTAR.GET_SUBJECT, payload);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setMediaSubjects(data);
                setLoading(false);
                setValue('subject', subjectId);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage)
            setLoading(false);
        }
    }

    useEffect(() => {
        getSubjects(AVTAR.GET_SUBJECT);
    }, []);
    return (<>
        <Modal
            show={status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
            centered
        >
            <>
                <Modal.Header>
                    <h2 className="modal-title fs-5 mb-0" id="exampleModalLabel">Photo Album</h2>
                    <span className="h3 btn-close" onClick={() => FnCallback()} role='pointer'></span>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="mb-3">
                            <label>Subject</label>
                            <select disabled={isLoading} {...register('subject')} className="form-control" onChange={(event) => handleChangeSubject(event)}>
                                <option value={null}></option>
                                {mediaSubjects.length > 0 && mediaSubjects.map((item, index) => {
                                    return <React.Fragment key={`subitem-key-${index}`}>
                                        <option value={item.subjectId} selected={item.subjectId === subjectId ? true : false}>{item.name}</option>
                                    </React.Fragment>
                                })}
                            </select>
                            {errors.subject && <p className='text-error'>{errors.subject.message}</p>}

                        </div>
                        <div className="mb-3">
                            <label>Enter Date</label>
                            <DatePicker
                                className="form-control"
                                format="MM-dd-yyyy"
                                onChange={(e) => onDobChange(e)}
                                value={getFormattedDate(photoDetails.mediaDate)}
                            />
                            {errors.mediaDate && <p className='text-error'>{errors.mediaDate.message}</p>}

                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                {...register('description')}
                                className="form-control"
                                placeholder="Leave a comment here"
                            />
                            {errors.description && <p className='text-error'>{errors.description.message}</p>}

                        </div>
                        <button type='submit' disabled={isLoading} className="btn primary-btn w-100">
                            Update {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                        </button>
                    </form>
                </Modal.Body>
            </>
        </Modal>
    </>
    )
}

export default UpdatePhotoModal;
const defaultProps = {
    selectedAvatar: {},
    FnCallback: undefined,
}
