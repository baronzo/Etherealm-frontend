import React, { useEffect, useRef, useState } from 'react'
import Lottie from "lottie-react";
import LottieLoading from '../lottie/lf20_2omr5gpu.json'
import './TestMap.scss'

type Props = {}

export default function TestMap({ }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    test()
    // console.log(canvasRef.current)
    // onStart()
  }, [])

  async function test() {
    for (let index = 0; index < 5; index++) {
      const response = await getBase64FromUrl('https://i1.sndcdn.com/artworks-Qdsc0Sgxu56jrRUL-FBDK7g-t500x500.jpg')
      console.log(response)
      console.log('------------------------------------------------------------------------')
    }
  }

  function onStart(): void {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext("2d");
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = 500
      canvasRef.current.height = 500
        if (context) {
          context.fillStyle = "#2AC161";
          context.fillRect(0, 0, 20, 20)
          context.fillRect(80, 80, 20, 20)
          for (let i = 0; i < 300; i+=60) {
            let image = new Image()
            console.log('before draw')
            image.onload = function() {
              context.drawImage(image, i, 0, 60, 60);
            };
            image.src = `https://i1.sndcdn.com/artworks-Qdsc0Sgxu56jrRUL-FBDK7g-t500x500.jpg`
            
            console.log('after draw')
          }
          
        }
    }
  }

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        // console.log(base64data)
        
        resolve(base64data);
      }
    });
  }

  function getCursorPosition(event: any) {
      if (canvasRef.current) {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
          context.fillStyle = "#000000";
          context.fillRect(0, 0, 20, 20)
  
          let image = new Image()
            // image.src = `https://i1.sndcdn.com/artworks-Qdsc0Sgxu56jrRUL-FBDK7g-t500x500.jpg`
            // image.crossOrigin = 'anonymous'
            console.log('before draw')
            // context.drawImage(image, 10, 10, 60, 60)
            image.onload = function() {
              context.drawImage(image, 0, 0, 60, 60);
            };
            image.src = `https://i1.sndcdn.com/artworks-Qdsc0Sgxu56jrRUL-FBDK7g-t500x500.jpg`
            console.log('after draw')
        }
    }
    // canvasRef.current?.toBlob(blob => {
    //   return new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(blob!); 
    //     reader.onloadend = () => {
    //       const base64data = reader.result;   
    //       console.log(base64data)
    //       resolve(base64data);
    //     }
    //   });
    // })

  }

  function getEventLocation(e: any) {
    if (e.touches && e.touches.length === 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY }
    }
  }

  function onPointerMove(e: any) {
    // if (isDragging) {
    //     cameraOffSet.x = getEventLocation(e)?.x / cameraZoom - dragStart.x
    //     cameraOffSet.y = getEventLocation(e)?.y / cameraZoom - dragStart.y
    //     isOnMouseDragging = true
    //     setUrl()
    // }
    // currentTransformedCursor = getTransformedPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
}
  
    return (
        <div id='testMapBox'>
            <canvas id='canvas' ref={canvasRef}
              onClick={(event) => getCursorPosition(event)}
              onMouseMove={onPointerMove}
            ></canvas>
        </div>
    )
}