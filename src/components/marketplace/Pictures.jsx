import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddPicture from "./AddPicture";
import Picture from "./Picture";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyPictureAction, createPictureAction, likeAction, changepriceAction, pausesaleAction, resumesaleAction,  deletePictureAction, getPicturesAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Pictures = ({address, fetchBalance}) => {
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPictures = async () => {
        setLoading(true);
        getPicturesAction()
            .then(pictures => {
                if (pictures) {
                    setPictures(pictures);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getPictures();
    }, []);

    const createPicture = async (data) => {
        setLoading(true);
        createPictureAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Picture added successfully."/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to create a picture."/>);
                setLoading(false);
            })
    };


    const likePicture = async (picture) => {
        setLoading(true);
        likeAction(address, picture)
            .then(() => {
                toast(<NotificationSuccess text="Picture liked successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to like picture."/>);
                setLoading(false);
            })
    };


    const changePrice = async (picture, newprice) => {
        setLoading(true);
        changepriceAction(address, picture, newprice)
            .then(() => {
                toast(<NotificationSuccess text="Price changed successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to change price."/>);
                setLoading(false);
            })
    };

    const pauseSale = async (picture) => {
        setLoading(true);
        pausesaleAction(address, picture)
            .then(() => {
                toast(<NotificationSuccess text="Sale paused successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to pause sale."/>);
                setLoading(false);
            })
    };


    const resumeSale = async (picture) => {
        setLoading(true);
        resumesaleAction(address, picture)
            .then(() => {
                toast(<NotificationSuccess text="Sale resumed successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="sale paused"/>);
                setLoading(false);
            })
    };




    const buyPicture = async (picture, count) => {
        setLoading(true);
        buyPictureAction(address, picture, count)
            .then(() => {
                toast(<NotificationSuccess text="Picture bought successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to buy picture."/>);
                setLoading(false);
            })
    };

    const deletePicture = async (picture) => {
        setLoading(true);
        deletePictureAction(address, picture.appId)
            .then(() => {
                toast(<NotificationSuccess text="Picture deleted successfully"/>);
                getPictures();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete picture."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Picturea</h1>
                <AddPicture createPicture={createPicture}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {pictures.map((data, index) => (
                        <Picture
                            address={address}
                            picture={data}
                            buyPicture={buyPicture}
                            changePrice = {changePrice}
                            pauseSale = {pauseSale}
                            resumeSale = {resumeSale}
                            likePicture = {likePicture}
                            deletePicture={deletePicture}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Pictures.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Pictures;
