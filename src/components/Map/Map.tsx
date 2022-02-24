import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Map.scss'

type Props = {}

interface LocationModel {
    x: number;
    y: number;
}

export default function Map({ }: Props) {
    const callbackKeyRef = useRef(-1);

    const width = 1000;
    const height = 1000;
    const box = 20
    const [xy, setXy] = useState<LocationModel | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    let canvasMinimapRef = useRef<HTMLCanvasElement>(null)
    let context: any = null
    const [startLocation, setstartLocation] = useState<LocationModel>({x: 0, y: 0})

    const [cameraMouseFocus, setCameraMouseFocus] = useState({ x: 0, y: 0 })
    const [cameraOffSet, setCameraOffSet] = useState({ x: 0, y: 0 })
    let cameraZoom = 1;
    let MAX_ZOOM = 1.5;
    let MIN_ZOOM = 0.5;
    let SCROLL_SENSITIVITY = -0.0006;

    let isDragging = false
    let isOnMouseDragging = false
    let dragStart = { x: 0, y: 0 }
    let initialPinchDistance: any = null
    let lastZoom = cameraZoom
    let currentTransformedCursor= { x: 0, y: 0 }
    let image: any = null

    
    const cameraZoomRef = useRef(cameraZoom)
    const cameraMouseFocusRef = useRef(cameraMouseFocus)


    const mapPosition: any = []

    useEffect(() => {
        setCameraOffSet({x: (window.innerWidth / 2) - (width / 2), y: (window.innerHeight / 2) - (height / 2)})
        console.log(mapPosition.length)
        // mapPosition.forEach(item => {
        //     console.log(item.start, item.end)
        // });
        // drawMinimap()
    }, [])

    useEffect(() => {
        cancelAnimationFrame(callbackKeyRef.current);
        cameraZoom = cameraZoomRef.current
        const update = () => {
            cameraZoomRef.current = drawboard()
            // drawMinimap()
            callbackKeyRef.current = requestAnimationFrame(update);
        }
        update()
    })

    async function getMapPosition() {

    }
    
    function drawMinimap() {
        if (canvasMinimapRef.current && canvasRef.current) {
            const minimapContext = canvasMinimapRef.current?.getContext("2d")
            if (minimapContext) {
                canvasMinimapRef.current.width = width / 1
                canvasMinimapRef.current.height = height / 1
                image = new Image()
                image.src = canvasRef.current.toDataURL()
                // image.src = 'https://inwfile.com/s-cv/rns73p.png'
                minimapContext.drawImage(image, 0, 0)
                console.log(canvasRef.current.toDataURL())
                console.log(canvasMinimapRef.current.width, canvasMinimapRef.current.height)
            }
        }
    }

    function drawboard() {
        if (canvasRef.current) {
            context = canvasRef.current?.getContext("2d");
            const rect = canvasRef.current.getBoundingClientRect();
            canvasRef.current.width = rect.width
            canvasRef.current.height = rect.height
            if (context) {
                // context.translate(cameraMouseFocusRef.current.x, cameraMouseFocusRef.current.y);
                // context.scale(cameraZoom, cameraZoom);
                // context.translate(-cameraMouseFocusRef.current.x + cameraOffSet.x, -cameraMouseFocusRef.current.y + cameraOffSet.y);

                context.translate(rect.width / 2, rect.height / 2)
                context.scale(cameraZoom, cameraZoom)
                context.translate(-rect.width / 2 + cameraOffSet.x, -rect.height / 2 + cameraOffSet.y)

                // context.translate(cameraMouseFocusRef.current.x, cameraMouseFocusRef.current.y)
                // context.scale(cameraZoom, cameraZoom)
                // context.translate(-cameraMouseFocusRef.current.x + cameraOffSet.x, -cameraMouseFocusRef.current.y + cameraOffSet.y)


                // mapPosition.forEach(item => {
                //     context.fillStyle = "#2AC161";
                //     context.fillRect(item.start.x, item.start.y, item.end.x - item.start.x, item.end.y - item.start.y);
                //     context.strokeStyle = "#323232";
                //     context.strokeRect(item.start.x, item.start.y, item.end.x - item.start.x, item.end.y - item.start.y);
                //     context.save();
                // })

                for (let x = 0; x < width; x+=20) {
                    for (let y = 0; y < height; y+=20) {
                        context.fillStyle = "#2AC161";
                        context.fillRect(x, y, box, box);
                        context.strokeStyle = "#323232";
                        context.strokeRect(x, y, box, box);
                        context.save();
                    }
                }

                // // วาดเส้นแนวตั้ง
                // for (let x = startLocation.x; x <= width + startLocation.x; x += box) {
                //     context.moveTo(x, startLocation.y)
                //     context.lineTo(x, height + startLocation.y)
                //     context.fillStyle = "#2AC161";
                //     context.fillRect(startLocation.x, startLocation.y, width, height);
                // }

                // // วาดเส้นแนวนอน
                // for (let y = startLocation.y; y <= height + startLocation.y; y += box) {
                //     context.moveTo(startLocation.x, y)
                //     context.lineTo(width + startLocation.x, y)
                //     context.fillStyle = "#2AC161";
                //     context.fillRect(startLocation.x, startLocation.y, width, height);
                // }

                context.strokeStyle = "black";
                context.stroke();

                changeSelectedColor(xy?.x!, xy?.y!)

            }
        }
        return cameraZoom
        
    }

    function getEventLocation(e: any) {
        if (e.touches && e.touches.length === 1) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        else if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    }

    function changeSelectedColor(x: number, y: number) {
        if (canvasRef.current) {
            const context = canvasRef.current?.getContext("2d");
            if (context) {
                if (x <= width/box && x > 0 && y <= height/box && y > 0) {
                    context.fillStyle = "#ED1E79";
                    context.fillRect((x * box - box) + startLocation.x, (y * box - box) + startLocation.y, box, box);
                    context.save();
                }
            }
        }
    }

    function getCursorPosition(event: any) {
        if (canvasRef.current) {
            if (!isOnMouseDragging) {
                // click
                const rect = canvasRef.current.getBoundingClientRect();
                // console.log(rect)
                const x = (currentTransformedCursor.x) - ((rect.left));
                const y = (currentTransformedCursor.y) - ((rect.top));

                const cy = ((y) + (box - ((y) % box))) / box;
                const cx = ((x) + (box - ((x) % box))) / box;

                setXy({x: cx, y: cy})
                // console.log(xy)
            }
            
        }
    }

    function onPointerDown(e: any) {
        isDragging = true
        isOnMouseDragging = false
        dragStart.x = getEventLocation(e)?.x / cameraZoom - cameraOffSet.x
        dragStart.y = getEventLocation(e)?.y / cameraZoom - cameraOffSet.y
    }

    function onPointerUp(e: any) {
        isDragging = false
        initialPinchDistance = null
        lastZoom = cameraZoom
    }



    function onPointerMove(e: any) {
        if (isDragging) {
            cameraOffSet.x = getEventLocation(e)?.x / cameraZoom - dragStart.x
            cameraOffSet.y = getEventLocation(e)?.y / cameraZoom - dragStart.y
            isOnMouseDragging = true
        }
        // console.log(getEventLocation(e)?.x / cameraZoom - dragStart.x, getEventLocation(e)?.y / cameraZoom - dragStart.y)
        currentTransformedCursor = getTransformedPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }

    function getTransformedPoint(x: number, y: number) {
        if (context) {
            const transform = context.getTransform()!
            const inverseZoom = 1 / transform.a;
            const transformedX = inverseZoom * x - inverseZoom * transform.e;
            const transformedY = inverseZoom * y - inverseZoom * transform.f;
            return { x: transformedX, y: transformedY };
        }
        return {x: 0, y: 0}
    }

    function handleTouch(e: any, singleTouchHandler: any) {
        if (e.touches.length === 1) {
            singleTouchHandler(e)
        }
        else if (e.type === "touchmove" && e.touches.length === 2) {
            isDragging = false
            handlePinch(e)
        }
    }

    function handlePinch(e: any) {
        e.preventDefault()

        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (initialPinchDistance === null) {
            initialPinchDistance = currentDistance
        }
        else {
            adjustZoom(null, currentDistance / initialPinchDistance)
        }
    }

    function adjustZoom(e: any, zoomFactor: any) {
        // let currentTargetRect = zoomAmount.currentTarget.getBoundingClientRect();
        // const event_offsetX = zoomAmount.pageX - currentTargetRect.left,
        // event_offsetY = zoomAmount.pageY - currentTargetRect.top;
        // console.log(event_offsetX + cameraOffSet.x, event_offsetY + cameraOffSet.y)
        // cameraMouseFocusRef.current = {x: event_offsetX, y: event_offsetY}

        let zoomAmount = e.deltaY * SCROLL_SENSITIVITY
        if (!isDragging) {
            if (zoomAmount) {
                cameraZoom += zoomAmount
            }
            else if (zoomFactor) {
                cameraZoom = zoomFactor * lastZoom
            }
            cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
            cameraZoom = Math.max(cameraZoom, MIN_ZOOM)
            // cameraMouseFocusRef.current = {x: currentTransformedCursor.x + cameraOffSet.x, y: currentTransformedCursor.y + cameraOffSet.y}
            // cameraMouseFocusRef.current = {x: event_offsetX + cameraOffSet.x, y: event_offsetY + cameraOffSet.y}
        }
    }
    
    return (
    <div id="mapMain">
        {/* <div id="miniMapBox">
            <canvas id="minimap" ref={canvasMinimapRef}></canvas>
        </div> */}
        <canvas
            id="canvas"
            ref={canvasRef}
            onClick={(event) => getCursorPosition(event)}
            onMouseDown={onPointerDown}
            onTouchStart={e => handleTouch(e, onPointerDown)}
            onMouseUp={onPointerUp}
            onTouchEnd={e => handleTouch(e, onPointerUp)}
            onMouseMove={onPointerMove}
            onTouchMove={e => handleTouch(e, onPointerMove)}
            onWheel={e => adjustZoom( e, null)}
        ></canvas>
    </div>
    )
}