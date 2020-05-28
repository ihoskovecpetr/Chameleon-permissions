import React, { useState, useEffect } from 'react';

export const usePaintMatches = ( ) => {

  const painter = (text, matches) => {

    let outcome = text
    matches.map(match => {
        if(text === match.value){
          outcome = <span style={{backgroundColor: "yellow"}}>{text}</span>
      }
    })

  return outcome
  }

  return painter;
}