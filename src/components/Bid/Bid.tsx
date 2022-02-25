import React from 'react'
import './Bid.scss'

type Props = {}

export default function Bid({ }: Props) {
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
                                <button  id='button1' className='bidCount'>-</button>
                                    <input id='input' className='bidCount' type="number" step="0.01" min="0.01"/>
                                <button  id='button2' className='bidCount'>+</button>
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
                    <div className='cardMain'>
                        <div className='bodyCard'>
                            <div className='imgCard'>
                                <img id='img' src="https://gelending.com/wp-content/uploads/2021/08/the-sandbox.jpg" alt="img-land" />
                            </div>
                            <div className='detailMain'>
                                <div className='textCard'>
                                    <label id='textCard'>LAND (99, 199)</label>
                                </div>
                                <div className='textCard'>
                                    <label id='textCard'>X: 99, Y:199</label>
                                </div>
                                <div className='textCard'>
                                    <label id='textToken'>0xcc896c2cdd10abaeas06...</label>
                                </div>
                            </div>
                            <div className='textBody'>
                                <div className='textTime'>
                                    <label id='textTime'>00:00:01</label>
                                </div>
                                <div className='textBid'>
                                    <label id='textBid'>0.05 eth</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
