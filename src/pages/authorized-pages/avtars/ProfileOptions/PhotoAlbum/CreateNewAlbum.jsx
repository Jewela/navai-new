import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions, { ACTION_SERVICES } from '../../../../../redux/authenticate/actions';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ENUM_AVTAR } from '../../../../../app/constants/enums';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faCircleXmark, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { postRequest, putRequest } from '../../../../../app/httpClient/axiosClient';
import { AVATAR_PARAMS, RESPONSE_CODE } from '../../../../../app/constants';
import { DEFAULT_VALUE } from '../../../../../app/constants';
import { AVTAR, MEDIA } from '../../../../../app/config/endpoints'
import { getErrorMessage } from '../../../../../utils/helpers/apiErrorResponse';
import { validateArrayProp } from '../../../../../utils/helpers/validate';
import { RESPONSE_MESSAGES } from '../../../../../app/constants/localizedStrings';
import { seoFriendlyName } from '../../../../../utils/helpers/functions';
import EditPhotoModal from './EditPhotoModal';
import toast from 'react-hot-toast';

const validationSchema = yup.object().shape({
    childhoodStory: yup.array().of(
        yup.object().shape({
            story: yup.string().required('Story is required'),
        })
    ),
});

function CreateNewAlbum(props) {
    const { avatar, mediaCategory, FnCallback } = props;
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

    const profileImgRef = useRef(null);
    const [vidoLinks, setVidoLinks] = useState([DEFAULT_VALUE.AVTAR.PHOTO_ALBUM.YT_LINKS]);

    const [prevAlbumPhotos, setPrevAlbumPhotos] = useState([]);
    const [albumPhotos, setAlbumPhotos] = useState([]);

    const [updateMode, setUpdateMode] = useState(false);
    const [addLinksValidation, setAddLinksValidation] = useState(false);
    const [deletedYoutubeLinks, setDeletedYoutubeLinks] = useState([]);
    const [deletedAlbumPhotos, setDeletedAlbumPhotos] = useState([]);
    const [newAddedYoutubeLinks, setNewAddedYoutubeLink] = useState([]);
    const [editModalStatus, setEditModalStatus] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(null);

    const [isLoading, setLoading] = useState(true);
    const [mediaSubjects, setMediaSubjects] = useState([]);

    const handleInputChange = useMemo(() => (event) => {
        const { name, value } = event.target;
        const index = parseInt(event.target.dataset.index);
        const propKey = event.target.dataset.propkey;
        const isNew = event.target.dataset.isnew;

        // if( isNew ) {
        //     setNewAddedYoutubeLink(...newAddedYoutubeLinks, value);
        // }

        setVidoLinks(prevVidoLinks => {
            const updatedVidoLinks = [...prevVidoLinks];
            updatedVidoLinks[index][propKey] = value;
            return updatedVidoLinks;
        });

    }, [vidoLinks]);

    const handleAddMoreLinks = () => {
        if (validateArrayProp(vidoLinks, 'link', setAddLinksValidation)) {
            setVidoLinks([...vidoLinks, { link: '', isNew: true }]);
        }
    };

    const handleRemoveDetailInputs = (index, isNew) => {
        if (!isNew && updateMode) {
            setDeletedYoutubeLinks([...deletedYoutubeLinks, vidoLinks[index].link])
        }

        setVidoLinks(prevStoryDetails => {
            return [...prevStoryDetails.slice(0, index), ...prevStoryDetails.slice(index + 1)]
        });

        if (vidoLinks.length === 1) { setVidoLinks([{ link: '', isNew: true }]); }
    };

    const { register, handleSubmit, formState: { errors }, setValue, setError, trigger } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(validationSchema),
    });

    const onHandleSubmit = async (data) => {
        try {
            dispatch(ACTION_SERVICES(actions.API_PROCESS));
            const _newYTLinks = [];
            const _newAlbumPhotos = [];
            let avatarImages = [];
            let response;

            albumPhotos.forEach(({ isNew, ...rest }) => {
                // console.log(rest)
                if (isNew) {
                    _newAlbumPhotos.push(rest.imageId);
                    avatarImages.push({
                        imageId: rest.imageId,
                        mediaDate: rest.mediaDate,
                        subjectId: parseInt(rest.subject),
                        description: rest.description
                    })
                }
            });

            vidoLinks.forEach(({ isNew, ...rest }) => {
                if (isNew && rest.link !== '') {
                    _newYTLinks.push(rest.link);
                }
            });

            let payloadData = {
                avatarId: props.avatar[AVATAR_PARAMS.avatarid],
                // avatarImages: avatarImages,
                avatarImages: avatarImages,
                mediaCategory: mediaCategory
            }

            // console.log(payloadData);
            // if (_newYTLinks.length > 0) payloadData['youtubeLinks'] = _newYTLinks;
            // if (_newAlbumPhotos.length > 0) payloadData['imageIds'] = _newAlbumPhotos;
            response = await postRequest(AVTAR.UPLOAD_AVATAR_ALBUM, payloadData);
            // response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);

            // console.log(response);
            // return false;

            // if (updateMode) {

            //     if (_newYTLinks.length > 0) payloadData['newAddedYoutubeLinks'] = _newYTLinks;
            //     if (_newAlbumPhotos.length > 0) payloadData['newAddedImageIds'] = _newAlbumPhotos;
            //     if (deletedYoutubeLinks.length > 0) payloadData['deletedYoutubeLinks'] = deletedYoutubeLinks;
            //     if (deletedAlbumPhotos.length > 0) payloadData['deletedImageIds'] = deletedAlbumPhotos;

            //     // payloadData['newAddedImageIds'] = [];
            //     // payloadData['deletedImageIds'] =[];
            //     response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);
            // } else {
            //     if (_newYTLinks.length > 0) payloadData['youtubeLinks'] = _newYTLinks;
            //     if (_newAlbumPhotos.length > 0) payloadData['imageIds'] = _newAlbumPhotos;
            //     response = await postRequest(AVTAR.UPLOAD_AVATAR_ALBUM, payloadData);
            //     // payloadData['imageIds'] = [];
            // }

            // console.log(payloadData);

            const { status, data: { result, httpStatusCode } } = response;
            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                const successMessage = updateMode ? 'Photo album updated successfully.' : 'Photo album created successfully.'
                dispatch({
                    type: actions.API_PROCESS_SUCCESS,
                    payload: { loader: false, successMessage: successMessage }
                });
                toast.success('Photo uploaded successfully.')
            }
            dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
            FnCallback();
        } catch (error) {
            console.log(error);
            dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, "Getting error while processing your request!"));
        }
    }

    const handleRemovePhotos = (imageId, isNew, index) => {
        if (!isNew && updateMode) {
            setDeletedAlbumPhotos([...deletedAlbumPhotos, imageId]);
        }

        setAlbumPhotos(prevPhotos => {
            return [...prevPhotos.slice(0, index), ...prevPhotos.slice(index + 1)]
        });
    };

    const handleEditPhotos = (index) => {
        setEditModalStatus(true)
        setPhotoIndex(index)
    };

    const handleAlbumPhotsChange = (e) => {

        // const newPhoto = {
        //     uploaded: true,
        //     imageId: 885,
        //     imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJ
        //     name: '',
        //     isNew: true,
        //     description: null,
        //     subject: null,
        //     mediaDate: null,
        // };

        // setAlbumPhotos([...albumPhotos, newPhoto]);
        // return false;
        const LOCALE = DEFAULT_VALUE.LOCALE
        let encodedFormatFile = null, fileName, contentType;
        const _INDEX = albumPhotos.length;
        const file = e.target.files[0];
        fileName = seoFriendlyName(file.name);
        contentType = file.type;
        const _reader = new FileReader();
        _reader.readAsDataURL(file);

        _reader.onload = async () => {
            encodedFormatFile = _reader.result;

            // console.log("_INDEX: ", _INDEX);

            const newPhoto = {
                uploaded: false,
                imageId: 0,
                imageUrl: encodedFormatFile,
                base64Url: encodedFormatFile,
                name: '',
                isNew: true,
                description: null,
                subject: null,
                mediaDate: null,
            };

            setAlbumPhotos([...albumPhotos, newPhoto]);

            try {
                dispatch(ACTION_SERVICES(actions.API_PROCESS));
                var payloadData = {
                    encodedFormatFile: encodedFormatFile,
                    fileName: fileName,
                    contentType: contentType,
                }

                const response = await postRequest(MEDIA.UPLOAD_IMAGE, payloadData);
                const { status, data: imageUploadData } = response;
                if (status === RESPONSE_CODE[200] && imageUploadData.httpStatusCode === RESPONSE_CODE[200]) {
                    const { imageId } = imageUploadData.data;
                    setAlbumPhotos(prevPhotos => {
                        const updatedPhotos = [...prevPhotos];
                        updatedPhotos[_INDEX] = {
                            ...prevPhotos[_INDEX],
                            uploaded: true,
                            imageId: imageId
                        };
                        return updatedPhotos;
                    });
                    dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
                } else {
                    dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED));
                }
            } catch (error) {
                let _error = getErrorMessage(error);
                dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED));
            }
        };

        _reader.onerror = (error) => {
            console.error('Getting error while previewing logo: ', error);
        };
    };

    const getSubjects = async (URL) => {
        try {
            setLoading(true);
            const payload = {
                mediaCategory: mediaCategory,
                avatarId: avatar[AVATAR_PARAMS.avatarid],
                filter: false
            }

            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(URL, payload);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setMediaSubjects(data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage)
            setLoading(false);
        }
    }

    const getSubjectName = (subjectId) => {
        const { name = '' } = mediaSubjects.find(item => item.subjectId === parseInt(subjectId));
        return name;
    }

    useEffect(() => {
        getSubjects(AVTAR.GET_SUBJECT);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, []);

    if (isLoading) {
        return (<>
            <section className="profile">
                <div className="container">
                    <div className="row">
                        <div className='d-flex flex-column justify-content-center align-items-center '>
                            <Spinner className="my-2 gradient-style chat-loading" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                            <p>Please wait...</p>
                        </div>
                    </div>
                </div>
            </section>
        </>)
    }

    return <>
        <section className="profile spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-9 mx-auto">
                        <div className="box-wrap">
                            <div className="box-header profile-option-title flex-column">
                                <div>
                                    <span onClick={() => FnCallback()} role="button">
                                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                                    </span>
                                </div>
                                <h2 className="h3 mb-0 mt-2">Photo album</h2>

                            </div>

                            <div className="box-body">
                                <form onSubmit={handleSubmit(onHandleSubmit)}>
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="">Upload Image</label>
                                            <div onClick={() => profileImgRef.current.click()} className="drop-zone">
                                                <span className="drop-zone__prompt">Click to upload</span>
                                                <input
                                                    ref={profileImgRef}
                                                    type="file"
                                                    accept="image/*"
                                                    name="photoAlbumImage"
                                                    className=""
                                                    multiple
                                                    style={{ display: 'none' }}
                                                    onChange={handleAlbumPhotsChange}
                                                />
                                            </div>
                                        </div>
                                        {/* <pre>
                                            {JSON.stringify(albumPhotos, null, 2)}
                                        </pre> */}
                                        <div className='row photo-listing'>
                                            {
                                                albumPhotos.map((photo, index) => (
                                                    <React.Fragment key={`photo-album-key${index}`}>

                                                        {/* <div className={`uploaded-album-photos-item ${!photo.uploaded && photo.isNew && 'upload-progress'}`}>
                                                                <img key={index} src={photo.imageUrl} alt='photo album' />
                                                                {photo.uploaded &&
                                                                    <span
                                                                        onClick={() => handleRemovePhotos(photo.imageId, photo.isNew, index)}
                                                                        key={`remove-photo-${index}`}
                                                                        className="remove-album-photo">
                                                                        <FontAwesomeIcon icon={faCircleXmark} />
                                                                    </span>
                                                                }
                                                            </div> */}

                                                        <div className="col-md-6">
                                                            <div className="photo_upload">
                                                                <div className="photo_upload__inner">
                                                                    <img src={photo.imageUrl} alt="photo" />
                                                                    <div className="photo_upload__action">
                                                                        <span onClick={() => handleEditPhotos(index)} role='button' className="action-btn btn-edit">
                                                                            <i className="ri-pencil-line" />
                                                                        </span>
                                                                        <span
                                                                            role='button'
                                                                            className="action-btn btn-del"
                                                                            onClick={() => handleRemovePhotos(photo.imageId, photo.isNew, index)}
                                                                        >
                                                                            <i className="ri-delete-bin-line" />
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="photo__upload-descp w-100">
                                                                    {photo?.subject && <span>{getSubjectName(photo?.subject)}</span>}
                                                                    {photo?.description && <p className="small">{photo?.description}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </div>

                                        <div className="col-md-12 mt-3">
                                            <Button
                                                variant="primary"
                                                disabled={loader}
                                                type='submit' className="btn primary-btn"
                                            >
                                                {loader
                                                    ? <>
                                                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Loading...</span>
                                                    </>
                                                    : updateMode ? 'Update' : 'Save'
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {editModalStatus &&
                    <EditPhotoModal
                        photoIndex={photoIndex}
                        editModalStatus={editModalStatus}
                        setEditModalStatus={setEditModalStatus}
                        albumPhotos={albumPhotos}
                        setAlbumPhotos={setAlbumPhotos}
                        mediaSubjects={mediaSubjects}
                        setMediaSubjects={setMediaSubjects}
                        avatarId={avatar[AVATAR_PARAMS.avatarid]}
                        mediaCategory={mediaCategory}
                    />
                }
            </div>
        </section>
    </>
}
export default CreateNewAlbum;