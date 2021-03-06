import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import CoordinatesModel from '../../models/lands/CoordinatesModel';
import LandModel from '../../models/lands/LandModel';
import LandService from '../../services/lands/LandService';
import authStore from '../../store/auth';
import LandModal from '../LandModal/LandModal';
import ModalLoadingPage from '../ModalLoadingPage/ModalLoadingPage';
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

    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const searchParams: URLSearchParams = new URLSearchParams(window.location.search)

    const [base64Image, setbase64Image] = useState<string>('')
    

    useEffect(() => {
        onStart()

        return () => {
            cancelAnimationFrame(callbackKeyRef.current)
            window.cancelAnimationFrame
        }
    }, [])

    useEffect(() => {
        if (loadingPage === false) {
            cancelAnimationFrame(callbackKeyRef.current);
            cameraZoom = cameraZoomRef.current
            const update = () => {
                cameraZoomRef.current = drawboard()
                drawMinimap()
                callbackKeyRef.current = requestAnimationFrame(update);
            }
            update()
        }
    })

    function onDrawMapAndMapToBase64Image(landLists: Array<LandModel>) {
        if (canvasRef.current) {
            context = canvasRef.current?.getContext("2d");
            canvasRef.current.width = width
            canvasRef.current.height = height
            if (context) {
                for (let x = 0; x < width; x+=20) {
                    for (let y = 0; y < height; y+=20) {
                        context.strokeStyle = "#cccccc";
                        context.strokeRect(x, y, 20, 20)
                    }
                }
                landLists.forEach((foundedLand, index) => {
                    context.fillStyle = "#2AC161";
                    context.fillRect(foundedLand.landPosition.x, foundedLand.landPosition.y, (foundedLand.landPosition.x + foundedLand.landSize.landSize) - foundedLand.landPosition.x, (foundedLand.landPosition.y + foundedLand.landSize.landSize) - foundedLand.landPosition.y)
                    context.strokeStyle = "#ffffff";
                    context.strokeRect(foundedLand.landPosition.x, foundedLand.landPosition.y, (foundedLand.landPosition.x + foundedLand.landSize.landSize) - foundedLand.landPosition.x, (foundedLand.landPosition.y + foundedLand.landSize.landSize) - foundedLand.landPosition.y)
                })
                context.save()
                setbase64Image(canvasRef.current!.toDataURL())
            }
        }
    }

    async function onStart(): Promise<void> {
        setLoadingPage(true)
        calculateMinZoom()
        const responseLand = await getMapDataFromApi()
        await onDrawMapAndMapToBase64Image(responseLand)
        if (zoomRangeRef.current) {
            zoomRangeRef.current.value = String(cameraZoom)
        }
        setCameraOffSet({x: (window.innerWidth / 2) - (width / 2), y: ((window.innerHeight - navbarSize) / 2) - (height / 2)})
        mapSearchParamsToVariable()
        // setUrl()
        setTimeout(() => {
            setLoadingPage(false)
        }, 500)
    }

    function setUrl(cameraZoomParam: number = cameraZoom, cameraOffetSetParams: LocationModel = cameraOffSet): void {
        // window.history.replaceState(null, '', window.location.pathname + `?zoom=${cameraZoom}&cameraOffSet=${cameraOffSet.x},${cameraOffSet.y}&currentTransformedCursor=${currentTransformedCursor.x},${currentTransformedCursor.y}`)
        window.history.replaceState(null, '', window.location.pathname + `?zoom=${cameraZoomParam}&cameraOffSet=${cameraOffetSetParams.x},${cameraOffetSetParams.y}`)
    }

    function autoFocusOnStart(): void {
        cameraZoomRef.current = 2
        cameraZoom = 2
        setCameraOffSet({x: 138.9340500894599, y: -580.6815401569717})
        setUrl(cameraZoom, {x: 138.9340500894599, y: -580.6815401569717})
    }

    function mapSearchParamsToVariable(): void {
        if (!searchParams.get('zoom') && !searchParams.get('cameraOffSet')) {
            autoFocusOnStart()
        } else {
            cameraZoomRef.current = searchParams.get('zoom') ? Number(searchParams.get('zoom')) : 1
            cameraZoom = searchParams.get('zoom') ? Number(searchParams.get('zoom')) : 1
    
            const cameraOffSetParams: Array<string> = searchParams.get('cameraOffSet')?.split(',') ?? ['0', '0']
            setCameraOffSet({x: Number(cameraOffSetParams[0]), y: Number(cameraOffSetParams[1])})
        }

        // const currentTransformedCursorParams: Array<string> = searchParams.get('currentTransformedCursor')?.split(',') ?? ['0', '0']
        // currentTransformedCursor = {x: Number(currentTransformedCursorParams[0]), y: Number(currentTransformedCursorParams[1])}

    }

    async function getMapDataFromApi(): Promise<Array<LandModel>> {
        let response: Array<LandModel> = await landService.getLands()
        setLands(response)
        return response
    }

    async function canvasToBase64Image(): Promise<void> {
        if (canvasRef.current) {
            canvasRef.current?.toBlob(blob => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob!); 
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        setbase64Image(base64data as string)
                        resolve(base64data);
                    }
                });
            })
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
            resolve(base64data);
          }
        });
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
                let image = new Image()
                image.src = base64Image
                context.drawImage(image, 0, 0, width, height)
                for (const item of lands) {
                    if (item.landAssets) {
                        let image = new Image()
                        image.src = item.landAssets
                        context.drawImage(image, item.landPosition.x, item.landPosition.y, item.landSize.landSize, item.landSize.landSize)
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
            const boxSize: number = selectedLand.landSize.landSize
            if (context) {
                if (selectedLand.landLocation.x <= width/20 && selectedLand.landLocation.x > 0 && selectedLand.landLocation.y <= height/20 && selectedLand.landLocation.y > 0) {
                    if (selectedLand.landAssets) {
                        context.strokeStyle = "#ED1E79";
                        context.strokeRect(selectedLand.landPosition.x, selectedLand.landPosition.y, (selectedLand.landPosition.x + selectedLand.landSize.landSize) - selectedLand.landPosition.x, (selectedLand.landPosition.y + selectedLand.landSize.landSize) - selectedLand.landPosition.y)
                    } else {
                        context.fillStyle = "#ED1E79";                   
                        context.fillRect(selectedLand.landPosition.x, selectedLand.landPosition.y, boxSize, boxSize)
                    }
                    context.save();
                }
            }
        }
    }

    function changeSelectedColorOnMinimap(x: number, y: number) {
        if (canvasMinimapRef.current) {
            const newContext = canvasMinimapRef.current?.getContext("2d");
            const boxSize: number = selectedLand.landSize.landSize
            if (newContext) {
                if (x <= width/(boxSize/viewScale) && x > 0 && y <= height/(boxSize/viewScale) && y > 0) {
                    newContext.fillStyle = "#ED1E79";
                    // newContext.fillRect((x * (boxSize/viewScale) - (boxSize/viewScale)), (y * (boxSize/viewScale) - (boxSize/viewScale)), (boxSize/viewScale), (boxSize/viewScale))
                    newContext.fillRect(((selectedLand.landPosition.x/viewScale)), (selectedLand.landPosition.y /viewScale), (boxSize/viewScale), (boxSize/viewScale))
                    newContext.save();
                }
            }
        }
    }

    function getCursorPosition(event: any) {
        if (canvasRef.current) {
            if (!isOnMouseDragging) {
                const boxSize = box
                const rect = canvasRef.current.getBoundingClientRect();
                const x = (currentTransformedCursor.x) - ((rect.left));
                const y = (currentTransformedCursor.y + navbarSize) - ((rect.top));
                const cy = ((y) + (boxSize - ((y) % boxSize))) / boxSize;
                const cx = ((x) + (boxSize - ((x) % boxSize))) / boxSize;
                let selectedLocation = {x: cx, y: cy}
                console.log(selectedLocation)
                let result: LandModel = new LandModel
                let found: boolean = false
                for (let index = lands.length - 1; index >= 0; index--) {
                    const locationList: Array<string> = lands[index].landLocationList.split(' ')
                    for (let i = 0; i < locationList.length; i++) {
                        const xx: number = Number(locationList[i].split(',')[0])
                        const yy: number = Number(locationList[i].split(',')[1])
                        if (xx === cx && yy === cy) {
                            result = lands[index]
                            found = true
                            break
                        }
                    }
                    if (found) {
                        break
                    }
                }
                if (result.landTokenId) {
                    setselectedLand(result)
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
            setUrl()
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
            setUrl()
        }
    }

    function onInputRange(event: ChangeEvent<HTMLInputElement>) {
        adjustZoom(null, null, Number(event.target.value))
    }

    function onDecreaseOrIncreaseZoom(value: number) {
        adjustZoom(null, null, cameraZoom + (0.025 * value))
    }

    async function onLandChangeFromModel(land: LandModel) {
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
        {loadingPage && <ModalLoadingPage/>}
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