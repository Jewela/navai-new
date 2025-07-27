import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../../app/constants/enums";

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
} from "../../../../../app/httpClient/axiosClient";
import { MEDIA_CATEGORY, RESPONSE_CODE } from "../../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../../app/constants";
import { AVTAR, MEDIA } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import { validateArrayProp } from "../../../../../utils/helpers/validate";
import { RESPONSE_MESSAGES } from "../../../../../app/constants/localizedStrings";
import { seoFriendlyName } from "../../../../../utils/helpers/functions";
import AlbumType from "./AlbumType";

const validationSchema = yup.object().shape({
  childhoodStory: yup.array().of(
    yup.object().shape({
      story: yup.string().required("Story is required"),
    })
  ),
});

const CATEGORY_OPTIONS = [
  {
    key: "family",
    value: "Photos",
    image: "/images/family-icon.svg",
    mediaCategoryType: MEDIA_CATEGORY.FAMILY,
  },
//   {
//     key: "travel",
//     value: "Travel",
//     image: "/images/family-icon.svg",
//     mediaCategoryType: MEDIA_CATEGORY.TRAVEL,
//   },
//   {
//     key: "scrapbook",
//     value: "Scrapbook",
//     image: "/images/family-icon.svg",
//     mediaCategoryType: MEDIA_CATEGORY.SCRAPBOOK,
//   },
];

function PhotoAlbum(props) {
  const { avatar } = props;

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

  const [category, setCategory] = useState(-1);

  const handleCategory = (index = -1) => {
    setCategory(index);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [category]);

  return (
    <>
      <section className="album spacer-lg">
        <div className="container">
          <div className="row">
            {category < 0 ? (
              <>
                <div className="col-md-12">
                  <span
                    role="button"
                    onClick={() => props.setProfileOption(null)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                  </span>
                </div>
                <div className="row justify-content-center mt-5">
                  {CATEGORY_OPTIONS.map((item, _index) => (
                    <React.Fragment key={_index}>
                      <div className="col-md-3">
                        <div className="album__col text-center mb-4 mb-md-0">
                          <span className="album__icon">
                            <img src={item.image} alt="family" />
                          </span>
                          <h2 className="h4 mb-3">{item.value}</h2>
                          <span
                            role="button"
                            onClick={() => handleCategory(_index)}
                          >
                            Click here
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : (
              <AlbumType
                category={CATEGORY_OPTIONS[category]}
                FnCallback={handleCategory}
                avatar={avatar}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
export default PhotoAlbum;
