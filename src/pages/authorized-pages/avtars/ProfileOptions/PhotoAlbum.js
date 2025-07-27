import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../app/constants/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCircleXmark,
  faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  postRequest,
  putRequest,
} from "../../../../app/httpClient/axiosClient";
import { RESPONSE_CODE } from "../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../app/constants";
import { AVTAR, MEDIA } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import { validateArrayProp } from "../../../../utils/helpers/validate";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import { seoFriendlyName } from "../../../../utils/helpers/functions";

const validationSchema = yup.object().shape({
  childhoodStory: yup.array().of(
    yup.object().shape({
      story: yup.string().required("Story is required"),
    })
  ),
});

function PhotoAlbum(props) {
  const {
    avatar: { images },
  } = props;
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  const profileImgRef = useRef(null);
  const [vidoLinks, setVidoLinks] = useState([
    DEFAULT_VALUE.AVTAR.PHOTO_ALBUM.YT_LINKS,
  ]);

  const [prevAlbumPhotos, setPrevAlbumPhotos] = useState([]);
  const [albumPhotos, setAlbumPhotos] = useState([]);

  const [updateMode, setUpdateMode] = useState(false);
  const [addLinksValidation, setAddLinksValidation] = useState(false);
  const [deletedYoutubeLinks, setDeletedYoutubeLinks] = useState([]);
  const [deletedAlbumPhotos, setDeletedAlbumPhotos] = useState([]);
  const [newAddedYoutubeLinks, setNewAddedYoutubeLink] = useState([]);

  const handleInputChange = useMemo(
    () => (event) => {
      const { name, value } = event.target;
      const index = parseInt(event.target.dataset.index);
      const propKey = event.target.dataset.propkey;
      const isNew = event.target.dataset.isnew;

      console.log(propKey, index);
      // if( isNew ) {
      //     setNewAddedYoutubeLink(...newAddedYoutubeLinks, value);
      // }

      setVidoLinks((prevVidoLinks) => {
        const updatedVidoLinks = [...prevVidoLinks];
        updatedVidoLinks[index][propKey] = value;
        return updatedVidoLinks;
      });
    },
    [vidoLinks]
  );

  const handleAddMoreLinks = () => {
    if (validateArrayProp(vidoLinks, "link", setAddLinksValidation)) {
      setVidoLinks([...vidoLinks, { link: "", isNew: true }]);
    }
  };

  const handleRemoveDetailInputs = (index, isNew) => {
    if (!isNew && updateMode) {
      setDeletedYoutubeLinks([...deletedYoutubeLinks, vidoLinks[index].link]);
    }

    setVidoLinks((prevStoryDetails) => {
      return [
        ...prevStoryDetails.slice(0, index),
        ...prevStoryDetails.slice(index + 1),
      ];
    });

    if (vidoLinks.length === 1) {
      setVidoLinks([{ link: "", isNew: true }]);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchema),
  });

  const onHandleSubmit = async (data) => {
    try {
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      const _newYTLinks = [];
      const _newAlbumPhotos = [];
      let response;

      albumPhotos.forEach(({ isNew, ...rest }) => {
        // console.log(rest)
        if (isNew) {
          _newAlbumPhotos.push(rest.imageId);
        }
      });

      vidoLinks.forEach(({ isNew, ...rest }) => {
        if (isNew && rest.link !== "") {
          _newYTLinks.push(rest.link);
        }
      });

      let payloadData = {
        avatarId: props.avatar.id,
      };

      if (updateMode) {
        if (_newYTLinks.length > 0)
          payloadData["newAddedYoutubeLinks"] = _newYTLinks;
        if (_newAlbumPhotos.length > 0)
          payloadData["newAddedImageIds"] = _newAlbumPhotos;
        if (deletedYoutubeLinks.length > 0)
          payloadData["deletedYoutubeLinks"] = deletedYoutubeLinks;
        if (deletedAlbumPhotos.length > 0)
          payloadData["deletedImageIds"] = deletedAlbumPhotos;

        // payloadData['newAddedImageIds'] = [];
        // payloadData['deletedImageIds'] =[];
        response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);
      } else {
        if (_newYTLinks.length > 0) payloadData["youtubeLinks"] = _newYTLinks;
        if (_newAlbumPhotos.length > 0)
          payloadData["imageIds"] = _newAlbumPhotos;
        response = await postRequest(AVTAR.UPLOAD_AVATAR_ALBUM, payloadData);
        // payloadData['imageIds'] = [];
      }

      // console.log(payloadData);

      const {
        status,
        data: { result, httpStatusCode },
      } = response;
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        const successMessage = updateMode
          ? "Photo album updated successfully."
          : "Photo album created successfully.";
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false, successMessage: successMessage },
        });
        props.setProfileOption(null);
        props.propSuccessMessage(successMessage);
      }
      dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
    } catch (error) {
      console.log(error);
      dispatch(
        ACTION_SERVICES(
          actions.API_PROCESS_FAILURE,
          false,
          "Getting error while processing your request!"
        )
      );
    }
  };

  const handleRemovePhotos = (imageId, isNew, index) => {
    if (!isNew && updateMode) {
      setDeletedAlbumPhotos([...deletedAlbumPhotos, imageId]);
    }

    setAlbumPhotos((prevPhotos) => {
      return [...prevPhotos.slice(0, index), ...prevPhotos.slice(index + 1)];
    });

    // if (vidoLinks.length === 1) { setVidoLinks([{ link: '', isNew: true }]); }
  };

  const handleAlbumPhotsChange = (e) => {
    let encodedFormatFile = null,
      fileName,
      contentType;
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
        name: "",
        isNew: true,
      };

      setAlbumPhotos([...albumPhotos, newPhoto]);

      try {
        dispatch(ACTION_SERVICES(actions.API_PROCESS));
        var payloadData = {
          encodedFormatFile: encodedFormatFile,
          fileName: fileName,
          contentType: contentType,
        };

        const response = await postRequest(MEDIA.UPLOAD_IMAGE, payloadData);
        const { status, data: imageUploadData } = response;
        if (
          status === RESPONSE_CODE[200] &&
          imageUploadData.httpStatusCode === RESPONSE_CODE[200]
        ) {
          const { imageId } = imageUploadData.data;
          setAlbumPhotos((prevPhotos) => {
            const updatedPhotos = [...prevPhotos];
            updatedPhotos[_INDEX] = {
              ...prevPhotos[_INDEX],
              uploaded: true,
              imageId: imageId,
            };
            return updatedPhotos;
          });
          dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
        } else {
          dispatch(
            ACTION_SERVICES(
              actions.API_PROCESS_FAILURE,
              false,
              RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED
            )
          );
        }
      } catch (error) {
        dispatch(
          ACTION_SERVICES(
            actions.API_PROCESS_FAILURE,
            false,
            RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED
          )
        );
      }
    };

    _reader.onerror = (error) => {
      console.error("Getting error while previewing logo: ", error);
    };
    // setFile(file);
    // setValue('avtarProfileImage', (e) => {
    //     const newValue = e.target.files[0];
    //     // perform validation here if needed
    //     return newValue;
    // });
  };

  useEffect(() => {
    const newLinks = [];
    const prevPhotos = [];
    images.forEach(({ isProfile, ...rest }) => {
      if (!isProfile) {
        rest.youtubeLinks.forEach((link) => {
          newLinks.push({ link: link, isNew: false });
        });
      }
      if (!isProfile && rest.id > 0) {
        prevPhotos.push({
          imageId: rest.id,
          uploaded: true,
          isNew: false,
          imageUrl: rest.imageBlobUrl,
        });
      }
    });
    setVidoLinks(newLinks.length > 0 ? newLinks : [{ link: "", isNew: true }]);
    setAlbumPhotos(prevPhotos.length > 0 ? prevPhotos : []);
    setPrevAlbumPhotos(prevPhotos.length > 0 ? prevPhotos : []);

    if (newLinks.length > 0 || prevPhotos.length > 0) {
      setUpdateMode(true);
    }
    dispatch({ type: actions.PROCESS_INIT });
    props.propSuccessMessage("");
  }, []);

  return (
    <>
      <section className="profile spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-9 mx-auto">
              <div className="box-wrap">
                <div className="box-header profile-option-title flex-column">
                  <div>
                    <span
                      onClick={() => props.setProfileOption(null)}
                      role="button"
                    >
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
                        <div
                          onClick={() => profileImgRef.current.click()}
                          className="drop-zone"
                        >
                          <span className="drop-zone__prompt">
                            Click to upload
                          </span>
                          <input
                            ref={profileImgRef}
                            type="file"
                            accept="image/*"
                            name="photoAlbumImage"
                            className="d-none"
                            multiple
                            onChange={handleAlbumPhotsChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mb-3 uploaded-album-photos">
                        {/* {
                                                prevAlbumPhotos.map((photo, index) => (
                                                    <div className={`uploaded-album-photos-item`}>
                                                        <img key={index} src={photo.imageUrl} alt='photo album' />
                                                        <span
                                                            onClick={() => handleRemovePhotos(photo.imageId, photo.isNew, index)}
                                                            key={`remove-photo-${index}`}
                                                            className="remove-album-photo">
                                                            <FontAwesomeIcon icon={faCircleXmark} />
                                                        </span>
                                                    </div>
                                                ))
                                            } */}
                        {albumPhotos.map((photo, index) => (
                          <div
                            className={`uploaded-album-photos-item ${
                              !photo.uploaded &&
                              photo.isNew &&
                              "upload-progress"
                            }`}
                          >
                            <img
                              key={index}
                              src={photo.imageUrl}
                              alt="photo album"
                            />
                            {photo.uploaded && (
                              <span
                                onClick={() =>
                                  handleRemovePhotos(
                                    photo.imageId,
                                    photo.isNew,
                                    index
                                  )
                                }
                                key={`remove-photo-${index}`}
                                className="remove-album-photo"
                              >
                                <FontAwesomeIcon icon={faCircleXmark} />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Add video</label>
                        {vidoLinks.map((video, index) => (
                          <>
                            <div
                              className="input-div input-control"
                              key={`video-${index}`}
                            >
                              <input
                                key={`input-${index}`}
                                type="text"
                                name="videolilnks"
                                value={video.link}
                                placeholder="Enter youtube link"
                                className="form-control mb-2"
                                onChange={handleInputChange}
                                data-index={index}
                                data-propkey="link"
                                data-isnews={video.isNew}
                              />
                              {vidoLinks.length > 0 && (
                                <span
                                  key={`remove-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(index, video.isNew)
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              )}
                            </div>
                          </>
                        ))}
                        {addLinksValidation ? (
                          <p className="text-error">This field is required.</p>
                        ) : (
                          ""
                        )}
                        <span
                          key="addmore"
                          onClick={() =>
                            loader ? false : handleAddMoreLinks()
                          }
                          className="add-child-story add-more"
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="plus"
                            className="svg-inline--fa fa-plus "
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="currentColor"
                              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                            ></path>
                          </svg>{" "}
                          Add more
                        </span>
                      </div>

                      {errorMessage && (
                        <div className="col-md-12 mt-1 mb-1">
                          <span className="text-error">{errorMessage}</span>
                        </div>
                      )}

                      {successMessage && (
                        <div className="col-md-12 mt-1 mb-1">
                          <span className="text-success">{successMessage}</span>
                        </div>
                      )}

                      <div className="col-md-12 mt-3">
                        <Button
                          variant="primary"
                          disabled={loader}
                          type="submit"
                          className="btn primary-btn"
                        >
                          {loader ? (
                            <>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              &nbsp;<span>Loading...</span>
                            </>
                          ) : updateMode ? (
                            "Update"
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default PhotoAlbum;
