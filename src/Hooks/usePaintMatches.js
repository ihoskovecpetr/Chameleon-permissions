import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

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
  

  // useEffect(() => {


    
  //   return () => {
  //     //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
  //   };
  // }, [text, matches] );

  return painter;
}