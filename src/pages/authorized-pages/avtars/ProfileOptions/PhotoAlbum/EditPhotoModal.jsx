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
import { postRequest } from '../../../../../app/httpClient/axiosClient';
import { Spinner } from 'react-bootstrap';

const subjectValidationSchema = yup.object().shape({
    subjectName: yup.string().required('Subject name is required.'),
});

const albumValidationSchema = yup.object().shape({
    subject: yup.string().required('Subject is required.'),
    mediaDate: yup.string().required('Date is required.'),
    description: yup.string().required('Description is required.'),
});

function EditPhotoModal(props) {
    const { photoIndex, setEditModalStatus, editModalStatus, albumPhotos, setAlbumPhotos, mediaSubjects, avatarId, mediaCategory, setMediaSubjects } = { ...defaultProps, ...props };

    // console.log(mediaSubjects);
    const [newSubject, setNewSubject] = useState(false);
    const [fetchingSubjectStatus, setFetchingSubjectStatus] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [photoDetails, setPhotoDetails] = useState({
        mediaDate: albumPhotos[photoIndex].mediaDate || null,
        subject: albumPhotos[photoIndex].subject || null,
        description: albumPhotos[photoIndex].description || null
    })

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        mode: 'all',
        resolver: yupResolver(newSubject ? subjectValidationSchema : albumValidationSchema),
    });

    const handleChange = (event, key) => {
        setPhotoDetails({ ...photoDetails, [key]: event.target.value })
    }

    const onDobChange = (_date) => {
        const inputDate = new Date(_date);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        setPhotoDetails({ ...photoDetails, mediaDate: formattedDate })
        setValue('mediaDate', formattedDate)
    }

    const handleSave = (data) => {
        const { subject, description, mediaDate } = data;
        setAlbumPhotos((prevAlbumPhotos) => {
            const updatedAlbumPhotos = [...prevAlbumPhotos];
            const updatedPhoto = {
                ...updatedAlbumPhotos[photoIndex],
                mediaDate: mediaDate,
                subject: subject,
                description: description,
            };
            updatedAlbumPhotos[photoIndex] = updatedPhoto;
            return updatedAlbumPhotos;
        });
        setEditModalStatus(false);
    }

    const handleChangeSubject = (event) => {
        if (event.target.value === 'add_new') {
            console.log('hereer')
            setNewSubject(true);
        }
        return;
    }

    const handleAddnewSubject = async (data) => {
        const { subjectName } = data
        const subjectPayload = {
            mediaCategory: mediaCategory,
            avatarId: avatarId,
            name: subjectName
        }
        console.log(subjectPayload);
        setLoading(true);
        // setTimeout(() => {
        //     setMediaSubjects([...mediaSubjects, {
        //         avatarId: avatarId,
        //         isCustom: true,
        //         mediaCategory: mediaCategory,
        //         name: subjectName,
        //         subjectId: 9,
        //     }]);
        //     setLoading(false);
        //     setNewSubject(false)
        //     reset();
        // }, 2000);

        try {
            setLoading(true);
            // const payload = {
            //     mediaCategory: mediaCategory,
            //     avatarId: avatar.id,
            //     filter: false
            // }

            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(AVTAR.ADD_SUBJECT, subjectPayload);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setFetchingSubjectStatus(true);
                toast.success('Subject added successfully.');
                fetchingSubject();
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

    const fetchingSubject = async () => {
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
                setFetchingSubjectStatus(false);
                setNewSubject(false);
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
        setValue('mediaDate', photoDetails.mediaDate)
        setValue('subject', photoDetails.subject)
        setValue('description', photoDetails.description)
    }, []);
    return (<>
        <Modal
            show={editModalStatus}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
            centered
        >
            {newSubject
                ? <>
                    <Modal.Header>
                        <h2 className="modal-title fs-5 mb-0" id="exampleModalLabel">Add new subject</h2>
                        {!isLoading && !fetchingSubjectStatus &&
                            <span className="h3 pointer" onClick={() => setNewSubject(false)}><i className="ri-close-line"></i></span>
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(handleAddnewSubject)}>
                            {
                                fetchingSubjectStatus
                                    ? <><div className="row">
                                        <div className='d-flex flex-column justify-content-center align-items-center '>
                                            <Spinner className="my-2 gradient-style chat-loading" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                                            <p>Please wait...</p>
                                        </div>
                                    </div></>
                                    : <><div className="mb-3">
                                        <label htmlFor="floatingInput">Subject</label>
                                        <input {...register('subjectName')} type='text' className='form-control' />

                                        {errors.subjectName && <p className='text-error'>{errors.subjectName.message}</p>}
                                    </div>
                                        <button type='submit' disabled={isLoading} className="btn primary-btn w-100">
                                            Add{isLoading && 'ing...'}
                                        </button></>

                            }

                        </form>
                    </Modal.Body>
                </>
                : <>
                    <Modal.Header>
                        <h2 className="modal-title fs-5 mb-0" id="exampleModalLabel">Photo Album</h2>
                        <span className="h3 btn-close" role="pointer" onClick={() => setEditModalStatus(false)}></span>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(handleSave)}>
                            <div className="mb-3">
                                <label>Subject</label>
                                <select {...register('subject')} className="form-control" onChange={(event) => handleChangeSubject(event)}>
                                    <option value={null}></option>
                                    {mediaSubjects.length > 0 && mediaSubjects.map((item, index) => {
                                        return <React.Fragment key={`subitem-key-${index}`}>
                                            <option value={item.subjectId}>{item.name}</option>
                                        </React.Fragment>
                                    })}
                                    <option value='add_new'>+Add new</option>
                                </select>
                                {errors.subject && <p className='text-error'>{errors.subject.message}</p>}

                            </div>
                            <div className="mb-3">
                                <label>Enter Date</label>
                                <DatePicker
                                    className="form-control"
                                    format="MM-dd-yyyy"
                                    onChange={(e) => onDobChange(e)}
                                    value={photoDetails.mediaDate}
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
                            <button type='submit' className="btn primary-btn w-100">Save</button>
                        </form>
                    </Modal.Body>
                </>
            }

        </Modal>
    </>
    )
}

export default EditPhotoModal;
const defaultProps = {
    photoIndex: 0,
    albumPhotos: [],
    editModalStatus: false,
    mediaSubjects: [],
}