import React, {useState, useEffect}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
// import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'


function PlaceOrderScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orderCreate = useSelector(state => state.orderCreate)
    const {order, error, success} = orderCreate

    const cart = useSelector(state => state.cart)

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = ((0.082) * cart.itemsPrice).toFixed(2)

    cart.totalPrice = (Number(cart.itemsPrice)  + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)


    useEffect(() => {
        if(!cart.paymentMethod){
            navigate('/payment')
        }
        if(success){
            navigate(`/order/${order._id}`)
        }
    }, [success, navigate])

    const placeOrder = () => {
        debugger;
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

  return (
    <div>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Shipping: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}
                            {'  '}
                            {cart.shippingAddress.postalCode},
                            {'  '}
                            {cart.shippingAddress.country},
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {
                        cart.cartItems.length === 0 ? 
                            <Message variant='info'>
                                Your cart is empty
                            </Message>: (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroupItem>
                                    ) )}
                                </ListGroup>
                            )
                        }
                    </ListGroup.Item>

                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Item:</Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroupItem>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroupItem>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-bloc'
                                disabled={cart.cartItems === 0}
                                onClick={placeOrder}
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default PlaceOrderScreen