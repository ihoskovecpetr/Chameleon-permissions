import React, { useState, useEffect } from 'react';

export const usePaginationLogic = (filteredResults) => {

  const [currentRange, setCurrentRange] = useState({
    from: 0,
    size: 10,
    pagesCount: 0
});

  
  useEffect(() => {
    setCurrentRange(prev => {
        console.log("Math.floor(filteredResults.length/prev.size) + 1: ", Math.floor(filteredResults.length/prev.size) + 1)
        return(
        {
            ...prev,
            from: 0,
            pagesCount: Math.floor(filteredResults.length/prev.size) + 1
        }
    )})
}, [filteredResults, currentRange.size])


const handlePagination = (e,page) => {
    console.log("Paginace: ", e, page)
    setCurrentRange(prev => {return(
        {
            ...prev,
            from: (page * prev.size - prev.size)
        }
    )})
}

const handleChangeSize = (e, choosen) => {
    console.log("handleChangeSize: ", choosen.props.value)
    setCurrentRange(prev => {return(
        {
            ...prev,
            size: choosen.props.value
        }
    )})
}

  return { currentRange, handlePagination, handleChangeSize }
}