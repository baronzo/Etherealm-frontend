import React, { useEffect, useRef, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import './Bid.scss'

type Props = {}

export default function Bid({ }: Props) {
    const [count, setCount] = useState(0)
    const [isDisabled, setIsDisabled] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0)
    const [mockImage, setMockImage] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'])
    const slideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentIndex(0)
    }, [])

    const addNumber = () => {
        setCount(count+0.01)
    }

    const removeNumber = () => {
        if(count === 0.01){
            setIsDisabled(!isDisabled)
        }
        else if (count >= 0.01) {
            setIsDisabled(isDisabled)
            setCount(count-0.01)
        }
    }

    const nextSlide = () => {
        if (currentIndex === mockImage.length - 1) {
            if (slideRef.current) {
                slideRef.current.scrollLeft = 0;
            }
            setCurrentIndex(0)
        } else {
            if (slideRef.current) {
                slideRef.current.scrollLeft = slideRef.current.scrollLeft + 245;
            }
            setCurrentIndex(currentIndex + 1)
        }
        console.log(currentIndex)
    }

    const prevSlide = () => {
        if (currentIndex === 0) {
            if (slideRef.current) {
                slideRef.current.scrollLeft = 245 * mockImage.length - 1;
            }
            setCurrentIndex(mockImage.length - 1)
        } else {
            if (slideRef.current) {
                slideRef.current.scrollLeft = slideRef.current?.scrollLeft - 245;
            }
            setCurrentIndex(currentIndex - 1)
        }
        console.log(currentIndex)
    }

    return (
        <div id="bidLayout">
            <div className='detailMain'>
                <div className='imgMain'>
                    <img id='imgLand' src="https://gelending.com/wp-content/uploads/2021/08/the-sandbox.jpg" alt="img-land" />
                </div>
                <div className='landLayout'>
                    <div className='textMain'>
                        <div className='textName'>
                            Perth Land
                        </div>
                        <div className='textTime'>
                            00 : 00 : 00
                        </div>
                        <div className='textBox'>
                            <div className='textLayout'>
                                <div className='text'>
                                    Price :
                                </div>
                                <div className='text'>
                                    <label id='textCount'>0.05</label>
                                    <label id='textEth'>eth</label>
                                </div>
                            </div>
                            <div className='textLayout'>
                                <div className='text'>
                                    highest bidder :
                                </div>
                                <div className='text'>
                                    Udomsak
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='buttonLayout'>
                            <div id='bar'></div>
                        <div className='buttonMain'>
                            <div className='buttoninput'>
                                <button  id='button1' className='bidCount' disabled={isDisabled} onClick={removeNumber}>-</button>
                                    <input id='input' className='bidCount' disabled={true} type="number" value={count.toFixed(2)} step="0.01" min="0.01"/>
                                <button  id='button2' className='bidCount' onClick={addNumber}>+</button>
                            </div>
                            <div className='buttonbid'>
                                <button id='button' className='bidAdd'>Bid</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='otherMain'>
                <label id='text'>Other Auction items now :</label>
                    <div id='bar'></div>
                <div className='slideMain'>
                    <div id='bidScroll' className='bidContainer' ref={slideRef} >
                     {mockImage.map((item, index) => {
                         return (
                            <div id='cardScroll' className={`bodyCard ${index === currentIndex ? 'active' : ''}`} key={index}>
                                    <img id='img' src="https://gelending.com/wp-content/uploads/2021/08/the-sandbox.jpg" alt="img-land" />
                                <div className='detailMain'>
                                    <div className='textCard'>
                                        <label id='textCard'>LAND (99, 199)</label>
                                    </div>
                                    <div className='textCard'>
                                        <MdLocationOn className='location-icon' />
                                        <label id='textCard'>X: 99, Y:199</label>
                                    </div>
                                    <div className='textCard'>
                                        <label id='textToken'>0xcc896c2cdd10abaea84da606344x3455u8gh366989836778256dgh33</label>
                                    </div>
                                </div>
                                <div className='textBody'>
                                    <div className='textTime'>
                                        <label id='textTime'>00:00:01</label>
                                    </div>
                                    <div className='textBid'>
                                        <FaGavel className='gavel-icon' />
                                        <label id='textBid'>0.05 eth</label>
                                    </div>
                                </div>
                            </div> 
                         )
                     })}    
                    </div>
                    <div className='buttons-wrapper'>
                        <AiOutlineLeft className='arrow' onClick={prevSlide} />
                        <AiOutlineRight className='arrow' onClick={nextSlide} />
                    </div>  
                </div>
            </div>
        </div>
    )
}
