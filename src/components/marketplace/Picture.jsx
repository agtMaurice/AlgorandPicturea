import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const Picture = ({address, picture, buyPicture, deletePicture, likePicture, changePrice, pauseSale, resumeSale}) => {
    const {name, image, description, price, likes, forsale, sold, appId, owner} =
        picture;

    const [count, setCount] = useState(1)
    const [newprice, setNewprice] = useState(0)

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner}/>
                        <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>

                        <Badge bg="secondary" className="ms-auto">
                            {likes} likes
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    <Form className="d-flex align-content-stretch flex-row gap-2">
                        <FloatingLabel
                            controlId="inputCount"
                            label="Count"
                            className="w-25"
                        >
                            <Form.Control
                                type="number"
                                value={count}
                                min="1"
                                max="10"
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        {picture.owner !== address && forsale === true &&
                        <Button
                            variant="outline-dark"
                            onClick={() => buyPicture(picture, count)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price) * count} ALGO
                        </Button>
                        }
                        {picture.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deletePicture(picture)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }

                        </Form>


             {picture.owner !== address &&
                            <Button
                                variant="outline-danger mt-2"
                                onClick={() => likePicture(picture)}
                                className="btn"
                            >
                               Like Picture
                            </Button>
                        }


             {picture.owner === address &&
    <>
							<Form.Control
								className={"pt-2 mb-1"}
								type="number"
								placeholder="Enter new price"
								onChange={(e) => {
									setNewprice(e.target.value);
								}}
							/>

							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => changePrice(picture, newprice)}
							>
							Change price
							</Button>
						</>
                        }


                   {picture.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => pauseSale(picture)}
                                className="btn"
                            >
                                Pause Sale
                            </Button>
                        }

                   {picture.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => resumeSale(picture)}
                                className="btn"
                            >
                                Resume Sale
                            </Button>
                        }


                  
                </Card.Body>
            </Card>
        </Col>
    );
};

Picture.propTypes = {
    address: PropTypes.string.isRequired,
    picture: PropTypes.instanceOf(Object).isRequired,
    buyPicture: PropTypes.func.isRequired,
    deletePicture: PropTypes.func.isRequired
};

export default Picture;
