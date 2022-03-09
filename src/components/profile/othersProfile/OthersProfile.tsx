import React from 'react'
import './OtherProfile.scss'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import ShowLands from '../showLands/ShowLands'

type Props = {}

export default function OthersProfile({ }: Props) {
    return (
        <div id='profileMain'>
            <div className='profile'>
                <div className='profile-container'>
                    <div className='profile-card'>
                        <div className='profile-image-div'>
                            <img className='profle-image' src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" />
                        </div>
                        <div className='name-div'>
                            <p className='name'>Anicha</p>
                        </div>
                        <div className='wallet-div'>
                            <p className='addreess'>0xcc896c2cdd10abafdgfbfbea84dabjhgjfdjf</p>
                            <div className='copy-buuton'>
                                <FaCopy className='copy-icon' />
                            </div>
                        </div>
                        <div className='user-description-div'>
                            <div className='user-description'>
                                <p className='text-description'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-land'>
                {/* <ShowLands /> */}
            </div>
        </div>
    )
}