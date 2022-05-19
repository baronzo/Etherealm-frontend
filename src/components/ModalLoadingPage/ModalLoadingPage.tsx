import React, { useState } from 'react'
import Lottie from "lottie-react";
import LottieLoading from '../lottie/lf20_2omr5gpu.json'
import './ModalLoadingPage.scss'

type Props = {}

export default function ModalLoadingPage({ }: Props) {
    return (
        <div id='loadingMain'>
            <Lottie loop={true} autoplay={true} animationData={LottieLoading} />
        </div>
    )
}