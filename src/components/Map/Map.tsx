import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import CoordinatesModel from '../../models/lands/CoordinatesModel';
import LandModel from '../../models/lands/LandModel';
import LandService from '../../services/lands/LandService';
import LandModal from '../LandModal/LandModal';
import './Map.scss'

type Props = {}

interface LocationModel {
    x: number;
    y: number;
}

export default function Map({ }: Props) {
    const landService: LandService = new LandService
    const callbackKeyRef = useRef(-1);

    const navbarSize: number = 55
    const width = 2000;
    const height = 2000;
    const box = 20
    let viewScale = 5
    const [xy, setXy] = useState<LocationModel | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    let canvasMinimapRef = useRef<HTMLCanvasElement>(null)
    let canvasMinimapViewportRef = useRef<HTMLCanvasElement>(null)
    let zoomRangeRef = useRef<HTMLInputElement>(null)
    let context: any = null

    const [cameraMouseFocus, setCameraMouseFocus] = useState({ x: 0, y: 0 })
    const [cameraOffSet, setCameraOffSet] = useState({x: 0, y: 0})
    let cameraZoom = 1;
    const [MAX_ZOOM, setMAX_ZOOM] = useState<number>(6)
    const [MIN_ZOOM, setMIN_ZOOM] = useState<number>(0.5)
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
    const [lands, setLands] = useState<Array<LandModel>>([])
    const [selectedLand, setselectedLand] = useState<LandModel>(new LandModel)
    
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
        calculateMinZoom()
        getMapDataFromApi()
        if (zoomRangeRef.current) {
            zoomRangeRef.current.value = String(cameraZoom)
        }
        setCameraOffSet({x: (window.innerWidth / 2) - (width / 2), y: ((window.innerHeight - navbarSize) / 2) - (height / 2)})
        getMapDataFromApi()
    }, [])

    async function getMapDataFromApi() {
        try {
            let response: Array<LandModel> = await landService.getLands()
            setLands(response)
        } catch (error) {
            
        }
    }

    function calculateMinZoom(): void {
        if (canvasRef.current) {
            if (!isOnMouseDragging) {
                const rect = canvasRef.current.getBoundingClientRect()
                setMIN_ZOOM(rect.height / width)
            }
        }
    }

    function drawMinimap() {
        if (canvasMinimapRef.current && canvasRef.current) {
            const minimapContext = canvasMinimapRef.current?.getContext("2d")
            if (minimapContext) {
                canvasMinimapRef.current.width = width / viewScale
                canvasMinimapRef.current.height = height / viewScale
                lands.forEach(item => {
                    minimapContext.fillStyle = "#2AC161";
                    minimapContext.fillRect(item.landPosition.x / viewScale, item.landPosition.y / viewScale, ((item.landPosition.x + item.landSize.landSize) - item.landPosition.x) / viewScale, ((item.landPosition.y + item.landSize.landSize) - item.landPosition.y) / viewScale)
                    minimapContext.save();
                })
                changeSelectedColorOnMinimap(selectedLand.landLocation.x, selectedLand.landLocation.y)
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
                let startX = (((rect?.width! / viewScale) / 2) - ((cameraOffSet.x) / viewScale)) - (((rect?.width! / viewScale) / cameraZoom) / 2)
                let startY = (((rect?.height! / viewScale) / 2) - (cameraOffSet.y / viewScale)) - (((rect?.height! / viewScale) / cameraZoom) / 2)
                minimapViewportContext.clearRect(startX, startY, (((rect?.width! / viewScale) / cameraZoom)) , (((rect?.height! / viewScale) / cameraZoom)))
                minimapViewportContext.strokeRect(startX, startY, (((rect?.width! / viewScale) / cameraZoom)) , (((rect?.height! / viewScale) / cameraZoom)))
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
                context.translate(rect.width / 2, rect.height / 2)
                context.scale(cameraZoom, cameraZoom)
                context.translate(-rect.width / 2 + cameraOffSet.x, -rect.height / 2 + cameraOffSet.y)
                for (const item of lands) {
                    context.fillStyle = "#2AC161";
                    context.fillRect(item.landPosition.x, item.landPosition.y, (item.landPosition.x + item.landSize.landSize) - item.landPosition.x, (item.landPosition.y + item.landSize.landSize) - item.landPosition.y)
                    context.strokeStyle = "#ffffff";
                    context.strokeRect(item.landPosition.x, item.landPosition.y, (item.landPosition.x + item.landSize.landSize) - item.landPosition.x, (item.landPosition.y + item.landSize.landSize) - item.landPosition.y)
                    context.save()
                    
                    if (item.landAssets) {
                        let image = new Image()
                        image.src = item.landAssets
                        context.drawImage(image, item.landPosition.x, item.landPosition.y, 20, 20)
                    }
                }
                changeSelectedColor()
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

    function changeSelectedColor() {
        if (canvasRef.current) {
            const context = canvasRef.current?.getContext("2d");
            if (context) {
                if (selectedLand.landLocation.x <= width/box && selectedLand.landLocation.x > 0 && selectedLand.landLocation.y <= height/box && selectedLand.landLocation.y > 0) {
                    if (selectedLand.landAssets) {
                        context.strokeStyle = "#ED1E79";
                        context.strokeRect(selectedLand.landPosition.x, selectedLand.landPosition.y, (selectedLand.landPosition.x + selectedLand.landSize.landSize) - selectedLand.landPosition.x, (selectedLand.landPosition.y + selectedLand.landSize.landSize) - selectedLand.landPosition.y)
                    } else {
                        context.fillStyle = "#ED1E79";
                        context.fillRect((selectedLand.landLocation.x * box - box), (selectedLand.landLocation.y * box - box), box, box)
                    }
                    context.save();
                }
            }
        }
    }

    function changeSelectedColorOnMinimap(x: number, y: number) {
        if (canvasMinimapRef.current) {
            const newContext = canvasMinimapRef.current?.getContext("2d");
            if (newContext) {
                if (x <= width/(box/viewScale) && x > 0 && y <= height/(box/viewScale) && y > 0) {
                    newContext.fillStyle = "#ED1E79";
                    newContext.fillRect((x * (box/viewScale) - (box/viewScale)), (y * (box/viewScale) - (box/viewScale)), (box/viewScale), (box/viewScale))
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
                let selectedLocation = {x: cx, y: cy}
                let result: Array<LandModel> = lands.filter(item => JSON.stringify(item.landLocation) === JSON.stringify(selectedLocation))
                if (result.length) {
                    setselectedLand(result[0])
                }
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

    function onLandChangeFromModel(land: LandModel) {
        let newLands: Array<LandModel> = [...lands]
        let index: number = lands.findIndex(x => x.landTokenId === land.landTokenId)
        if (index != -1) {
            newLands[index] = land
            setLands(newLands)
        }
    }
    
    return (
    <div id="mapMain">
        <LandModal land={selectedLand} onLandChange={(value) => onLandChangeFromModel(value)}/>
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