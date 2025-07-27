import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Spinner } from "react-bootstrap";
function AvatarMedias(props) {
    const { mediaList, FnCallback, FnHandleDelete = undefined, isDeleting, deleteImageIndex } = props;

    return (<>
        {mediaList.map((mediaItem, index) => (
            <React.Fragment key={`avatar-media-list-${index}`}>
                <div
                    role="button"
                    key={mediaItem.id}
                    className="avator__items position-relative sasasasSA"
                >
                    <div className="avator__headshot mb-3 position-relative overflow-hidden">
                        <div role="button" onClick={() => FnHandleDelete(mediaItem.id, mediaItem.mediaCategory, index)} className="dlt-photo-album position-absolute p-2">
                            <FontAwesomeIcon className="text-right" icon={faTrashAlt} />
                        </div>
                        <img
                            src={mediaItem.imageBlobUrl ? mediaItem.imageBlobUrl : '/images/avator-4.jpg'}
                            alt={mediaItem.fileName}
                            className="rounded-10"
                            onClick={() => FnCallback(mediaItem)}
                        />
                        {isDeleting && deleteImageIndex === index &&
                            <div className='avatar-specific-loader'>
                                <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                            </div>
                        }
                    </div>
                </div>
            </React.Fragment>
        ))}
    </>)
}

export default AvatarMedias