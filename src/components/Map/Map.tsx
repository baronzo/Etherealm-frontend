import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
    let canvasMinimapViewportRef = useRef<HTMLCanvasElement>(null)
    let zoomRangeRef = useRef<HTMLInputElement>(null)
    let context: any = null

    const [cameraMouseFocus, setCameraMouseFocus] = useState({ x: 0, y: 0 })
    const [cameraOffSet, setCameraOffSet] = useState({x: 0, y: 0})
    let cameraZoom = 1;
    let MAX_ZOOM = 5;
    let MIN_ZOOM = 0.5;
    let SCROLL_SENSITIVITY = -0.0005;

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
    const navbarSize: number = 55

    
    useEffect(() => {
        cancelAnimationFrame(callbackKeyRef.current);
        cameraZoom = cameraZoomRef.current
        
        const update = () => {
            cameraZoomRef.current = drawboard()
            drawMinimap()
            callbackKeyRef.current = requestAnimationFrame(update);
        }
        update()
    })

    useEffect(() => {
        if (zoomRangeRef.current) {
            zoomRangeRef.current.value = String(cameraZoom)
        }
        setCameraOffSet({x: (window.innerWidth / 2) - (width / 2), y: ((window.innerHeight - navbarSize) / 2) - (height / 2)})
    }, [])


    async function getMapPosition() {

    }
    
    function drawMinimap() {
        if (canvasMinimapRef.current && canvasRef.current) {
            const minimapContext = canvasMinimapRef.current?.getContext("2d")
            if (minimapContext) {
                let viewScale = 5
                canvasMinimapRef.current.width = width / viewScale
                canvasMinimapRef.current.height = height / viewScale
                for (let x = 0; x < canvasMinimapRef.current.width; x+=(box/viewScale)) {
                    for (let y = 0; y < canvasMinimapRef.current.height; y+=(box/viewScale)) {
                        minimapContext.fillStyle = "#2AC161";
                        minimapContext.fillRect(x, y, box/viewScale, box/viewScale);
                        minimapContext.save();
                    }
                }
                changeSelectedColorOnMinimap(xy?.x!, xy?.y!)
                drawViewportOnMinimap()
            }
        }
    }

    function drawViewportOnMinimap() {
        if (canvasMinimapViewportRef.current && canvasMinimapRef.current) {
            const minimapViewportContext = canvasMinimapViewportRef.current?.getContext("2d")
            if (minimapViewportContext) {
                canvasMinimapViewportRef.current.width = canvasMinimapRef.current.width
                canvasMinimapViewportRef.current.height = canvasMinimapRef.current.height
                minimapViewportContext.fillStyle = "#0000006c";
                minimapViewportContext.fillRect(0, 0, canvasMinimapViewportRef.current.width, canvasMinimapViewportRef.current.height);
                context = canvasRef.current?.getContext("2d")
                const rect = canvasRef?.current?.getBoundingClientRect()
                minimapViewportContext.strokeStyle = "red";
                let startX = (((rect?.width! / 5) / 2) - ((cameraOffSet.x) / 5)) - (((rect?.width! / 5) / cameraZoom) / 2)
                let startY = (((rect?.height! / 5) / 2) - (cameraOffSet.y / 5)) - (((rect?.height! / 5) / cameraZoom) / 2)
                minimapViewportContext.clearRect(startX, startY, (((rect?.width! / 5) / cameraZoom)) , (((rect?.height! / 5) / cameraZoom)))
                minimapViewportContext.strokeRect(startX, startY, (((rect?.width! / 5) / cameraZoom)) , (((rect?.height! / 5) / cameraZoom)))
                minimapViewportContext.save();
            }
        }
    }

    function drawboard() {
        if (canvasRef.current) {
            context = canvasRef.current?.getContext("2d");
            const rect = canvasRef.current.getBoundingClientRect();
            canvasRef.current.width = window.innerWidth
            canvasRef.current.height = window.innerHeight - navbarSize
            if (context) {
                // context.translate(cameraMouseFocusRef.current.x, cameraMouseFocusRef.current.y);
                // context.scale(cameraZoom, cameraZoom);
                // context.translate(-cameraMouseFocusRef.current.x + cameraOffSet.x, -cameraMouseFocusRef.current.y + cameraOffSet.y);

                context.translate(rect.width / 2, rect.height / 2)
                context.scale(cameraZoom, cameraZoom)
                context.translate(-rect.width / 2 + cameraOffSet.x, -rect.height / 2 + cameraOffSet.y)
                // console.log(-rect.width / 2 + cameraOffSet.x, -rect.height / 2 + cameraOffSet.y)

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
                        context.strokeStyle = "#ffffff";
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
                    context.fillRect((x * box - box), (y * box - box), box, box)
                    context.save();
                }
            }
        }
    }

    function changeSelectedColorOnMinimap(x: number, y: number) {
        if (canvasMinimapRef.current) {
            const newContext = canvasMinimapRef.current?.getContext("2d");
            if (newContext) {
                if (x <= width/(box/5) && x > 0 && y <= height/(box/5) && y > 0) {
                    newContext.fillStyle = "#ED1E79";
                    newContext.fillRect((x * (box/5) - (box/5)), (y * (box/5) - (box/5)), (box/5), (box/5))
                    newContext.save();
                }
            }
        }
    }

    function getCursorPosition(event: any) {
        if (canvasRef.current) {
            if (!isOnMouseDragging) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = (currentTransformedCursor.x) - ((rect.left));
                const y = (currentTransformedCursor.y + navbarSize) - ((rect.top));
                const cy = ((y) + (box - ((y) % box))) / box;
                const cx = ((x) + (box - ((x) % box))) / box;
                console.log(cameraOffSet)
                console.log(rect)
                setXy({x: cx, y: cy})
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

    function adjustZoom(e: any, zoomFactor: any, zoom: number | null = null) {
        // let currentTargetRect = zoomAmount.currentTarget.getBoundingClientRect();
        // const event_offsetX = zoomAmount.pageX - currentTargetRect.left,
        // event_offsetY = zoomAmount.pageY - currentTargetRect.top;
        // console.log(event_offsetX + cameraOffSet.x, event_offsetY + cameraOffSet.y)
        // cameraMouseFocusRef.current = {x: event_offsetX, y: event_offsetY}

        if (!isDragging) {
            if (zoom) {
                cameraZoom = zoom
                return
            }
            let zoomAmount = e.deltaY * SCROLL_SENSITIVITY
            if (zoomAmount) {
                cameraZoom += zoomAmount
                if (zoomRangeRef.current) {
                    zoomRangeRef.current.value = String(cameraZoom)
                }
            }
            else if (zoomFactor) {
                cameraZoom = zoomFactor * lastZoom
            }
            cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
            cameraZoom = Math.max(cameraZoom, MIN_ZOOM)
        }
    }

    function onInputRange(event: ChangeEvent<HTMLInputElement>) {
        adjustZoom(null, null, Number(event.target.value))
    }

    function onDecreaseOrIncreaseZoom(value: number) {
        adjustZoom(null, null, cameraZoom + (0.025 * value))
    }
    
    return (
    <div id="mapMain">
        <div id="miniMapBox">
            <canvas id="minimap" ref={canvasMinimapRef}></canvas>
            <canvas id="minimapViewport" ref={canvasMinimapViewportRef}></canvas>
            <div id="minimapZoomRangeBox">
                <button className='zoom-button' onClick={() => onDecreaseOrIncreaseZoom(-1)}>-</button>
                <input type="range" name="" id="zoomRange" min={MIN_ZOOM} max={MAX_ZOOM} step={Math.abs(SCROLL_SENSITIVITY)} ref={zoomRangeRef} 
                    onInput={(event: ChangeEvent<HTMLInputElement>) => onInputRange(event)}
                />
                <button className='zoom-button' onClick={() => onDecreaseOrIncreaseZoom(1)}>+</button>
            </div>
        </div>
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