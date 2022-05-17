import React, { useEffect, useState } from 'react'
import './Pagination.scss'

type Props = {
    isFirst: boolean
    isLast: boolean
    totalPage: number
    currentPage: number
    sendPageNumber: (pageNumber: number) => void
}

export default function Pagination({currentPage, isFirst, isLast, totalPage, sendPageNumber}: Props) {

    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        sendPageNumberToParent(page)
    }, [page])
    

    async function sendPageNumberToParent(pageNumber: number): Promise<void> {
        sendPageNumber(pageNumber)
    }

    return (
        <div id="paginateMain" >
            <div className="paginateButtonBox">
                <div className={`paginate-button ${isFirst || currentPage === 0 ? 'disable' : ''}`} onClick={() => !isFirst ? setPage(1) : undefined}>{'<<'}</div>
                <div className={`paginate-button ${isFirst || currentPage === 0 ? 'disable' : ''}`} onClick={() => !isFirst ? setPage(currentPage - 1) : undefined}>{'<'}</div>
                <div className={`paginate-button ${!isFirst && isLast && (currentPage - 2) > 0 ? '' : 'hidden' }`} onClick={() => setPage(currentPage - 2)}>{currentPage - 2}</div>
                <div className={`paginate-button ${currentPage - 1 > 0 ? '' : 'hidden' }`} onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</div>
                <div className={`paginate-button active`}>{currentPage}</div>
                <div className={`paginate-button ${currentPage + 1 <= totalPage ? '' : 'hidden'}`} onClick={() => setPage(currentPage + 1)}>{currentPage + 1}</div>
                <div className={`paginate-button ${!isLast && isFirst && (currentPage + 2) <= totalPage ? '' : 'hidden'}`} onClick={() => setPage(currentPage + 2)}>{currentPage + 2}</div>
                <div className={`paginate-button ${isLast || currentPage === 0 ? 'disable' : ''}`} onClick={() => !isLast ? setPage(currentPage + 1) : undefined}>{'>'}</div>
                <div className={`paginate-button ${isLast || currentPage === 0 ? 'disable' : ''}`} onClick={() => !isLast ? setPage(totalPage) : undefined}>{'>>'}</div>
            </div>
        </div>
    )
}