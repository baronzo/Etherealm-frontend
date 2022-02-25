import React, { useState } from 'react'

type Props = {
    isFirst: boolean
    isLast: boolean
    totalPage: number
    currentPage: number
    onSelectPage: any
}

export default function Pagination({ isFirst, isLast, totalPage, currentPage, onSelectPage }: Props) {

    const [page, setPage] = useState<number>(1)

    return (
        <div id="paginateMain" >
            <div className="paginateButtonBox">
                <div className='paginate-button'>{'<<'}</div>
                <div className='paginate-button'>{'<'}</div>
                <div className='paginate-button'>{currentPage - 2}</div>
                <div className='paginate-button'>{currentPage - 1}</div>
                <div className='paginate-button'>{currentPage}</div>
                <div className='paginate-button'>{currentPage + 1}</div>
                <div className='paginate-button'>{currentPage + 2}</div>
                <div className='paginate-button'>{'>'}</div>
                <div className='paginate-button'>{'>>'}</div>
            </div>
        </div>
    )
}